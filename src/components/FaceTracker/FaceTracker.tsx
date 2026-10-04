import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { RefObject } from 'react';
import styled from 'styled-components';
import {
  CENTER_GAZE_KEY,
  EXPRESSION_KEYS,
  GAZE_KEYS,
  expressionKey,
  faceUrl,
  gazeKey,
  isExpression,
  isFaceSetFor,
} from './faceAssets';
import type { Expression, FaceKey } from './faceAssets';
import { normalizePointer, smoothingFactor, toCellIndex } from './gaze';
import type { Point } from './gaze';

/* ── Styles : le cadre remplit son parent (taille, rayon et overflow hérités) ── */

const Frame = styled.span`
  position: absolute;
  inset: 0;
  display: block;
  user-select: none;
`;

/**
 * Légère parallaxe continue (vers le curseur) entre deux images de la grille :
 * le mouvement paraît fluide au lieu de sauter de case en case. Le zoom de
 * PARALLAX_SCALE garde les bords du cadre couverts pendant le déplacement.
 */
const PARALLAX_SCALE = 1.08;
const PARALLAX_SHIFT_PCT = 3;

const Parallax = styled.span`
  position: absolute;
  inset: 0;
  display: block;
  transform: scale(${PARALLAX_SCALE});
  will-change: transform;
`;

const layerStyles = `
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
`;

const BaseImage = styled.img`
  ${layerStyles}
`;

const FaceLayer = styled(motion.img)`
  ${layerStyles}
`;

/* ── Réglages ── */

/** Durée du fondu entre deux images (assez court pour rester net, sans flou). */
const CROSSFADE_S = 0.1;
/** Durée d'affichage d'une expression déclenchée au tap (écrans tactiles). */
const TAP_EXPRESSION_MS = 1400;
/** En dessous de cet écart, le lissage est considéré comme terminé. */
const SETTLE_EPSILON = 0.002;

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';
const NO_HOVER_QUERY = '(hover: none)';

/* ── Hooks utilitaires ── */

function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * Charge et décode les images ; résout `false` si l'une d'elles est introuvable.
 * Les objets Image sont ajoutés à `keep` pour rester en mémoire tant que le composant vit.
 */
function preloadImages(urls: string[], keep: HTMLImageElement[]): Promise<boolean> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          keep.push(img);
          img.decoding = 'async';
          img.onload = () => {
            img.decode().then(resolve, resolve);
          };
          img.onerror = () => reject(new Error(url));
          img.src = url;
        }),
    ),
  ).then(
    () => true,
    () => false,
  );
}

function expressionFrom(target: EventTarget | null): Expression | null {
  if (!(target instanceof Element)) return null;
  const value = target.closest<HTMLElement>('[data-expression]')?.dataset.expression;
  return isExpression(value) ? value : null;
}

/* ── Crossfade : la nouvelle image apparaît au-dessus de la précédente ── */

interface LayerState {
  id: number;
  src: string;
}

function useCrossfade(initialSrc: string) {
  const [layers, setLayers] = useState<{ previous: LayerState | null; current: LayerState }>({
    previous: null,
    current: { id: 0, src: initialSrc },
  });
  const currentSrc = useRef(initialSrc);

  const show = useCallback((src: string) => {
    if (src === currentSrc.current) return;
    currentSrc.current = src;
    setLayers(({ current }) => ({ previous: current, current: { id: current.id + 1, src } }));
  }, []);

  return { layers, show };
}

/* ── Composant ── */

export interface FaceTrackerProps {
  /** Photo d'origine : affichée en statique et tant que les images ne sont pas prêtes. */
  src: string;
  alt: string;
  /** Zone qui écoute le curseur (toute la section Hero, pas seulement la photo). */
  trackingRef: RefObject<HTMLElement>;
}

type Mode = 'static' | 'pointer' | 'touch';

/**
 * Photo de profil qui suit le curseur du regard et change d'expression au
 * survol des éléments `[data-expression]` de la zone suivie.
 *
 * Aucune animation en temps réel : on affiche l'image pré-générée
 * (`public/face/`) correspondant à la case de la grille 5×5 visée, et l'état
 * React ne change que lorsque cette case change.
 */
export function FaceTracker({ src, alt, trackingRef }: FaceTrackerProps) {
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);
  const noHover = useMediaQuery(NO_HOVER_QUERY);
  const frameRef = useRef<HTMLSpanElement>(null);
  const parallaxRef = useRef<HTMLSpanElement>(null);
  const preloaded = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);
  const { layers, show } = useCrossfade(src);

  const enabled = !reducedMotion && isFaceSetFor(src);
  const mode: Mode = !enabled ? 'static' : finePointer ? 'pointer' : noHover ? 'touch' : 'static';

  // Préchargement : toute la grille en mode souris, seulement les expressions au tactile.
  useEffect(() => {
    setReady(false);
    if (mode === 'static') return undefined;
    const keys: FaceKey[] = mode === 'pointer' ? [...GAZE_KEYS, ...EXPRESSION_KEYS] : EXPRESSION_KEYS;
    let cancelled = false;
    preloadImages(keys.map(faceUrl), preloaded.current).then((ok) => {
      if (!cancelled) setReady(ok);
    });
    return () => {
      cancelled = true;
    };
  }, [mode]);

  // Retour à la photo d'origine quand le suivi est coupé (reduced-motion activé, etc.).
  useEffect(() => {
    if (mode === 'static' || !ready) show(src);
  }, [mode, ready, show, src]);

  /* Mode souris : lissage dans une boucle rAF qui s'arrête une fois stabilisée. */
  useEffect(() => {
    const area = trackingRef.current;
    const frame = frameRef.current;
    const parallax = parallaxRef.current;
    if (mode !== 'pointer' || !ready || !area || !frame || !parallax) return undefined;

    let pointer: Point | null = null;
    let hoverExpression: Expression | null = null;
    let focusExpression: Expression | null = null;
    const current: Point = { x: 0, y: 0 };
    let rafId = 0;
    let lastTime = 0;

    const tick = (time: number) => {
      const delta = lastTime ? Math.min(time - lastTime, 100) : 1000 / 60;
      lastTime = time;

      let target: Point = { x: 0, y: 0 };
      if (pointer) {
        const rect = frame.getBoundingClientRect();
        const anchor = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        target = normalizePointer(pointer, anchor, area.getBoundingClientRect());
      }

      const k = smoothingFactor(delta);
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      const settled =
        Math.abs(target.x - current.x) < SETTLE_EPSILON && Math.abs(target.y - current.y) < SETTLE_EPSILON;
      if (settled) {
        current.x = target.x;
        current.y = target.y;
      }

      parallax.style.transform = `translate3d(${current.x * PARALLAX_SHIFT_PCT}%, ${
        current.y * PARALLAX_SHIFT_PCT
      }%, 0) scale(${PARALLAX_SCALE})`;

      const expression = hoverExpression ?? focusExpression;
      const key = expression
        ? expressionKey(expression)
        : gazeKey(toCellIndex(current.y), toCellIndex(current.x));
      show(faceUrl(key));

      rafId = settled ? 0 : requestAnimationFrame(tick);
      if (settled) lastTime = 0;
    };

    const schedule = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pointer = { x: event.clientX, y: event.clientY };
      hoverExpression = expressionFrom(event.target);
      schedule();
    };
    const onPointerLeave = () => {
      pointer = null;
      hoverExpression = null;
      schedule();
    };
    // Navigation clavier : un élément focalisé déclenche aussi son expression.
    // Limité à :focus-visible pour qu'un clic souris ne fige pas l'expression.
    const onFocusIn = (event: FocusEvent) => {
      const keyboard = event.target instanceof Element && event.target.matches(':focus-visible');
      focusExpression = keyboard ? expressionFrom(event.target) : null;
      schedule();
    };
    const onFocusOut = () => {
      focusExpression = null;
      schedule();
    };

    area.addEventListener('pointermove', onPointerMove, { passive: true });
    area.addEventListener('pointerleave', onPointerLeave);
    area.addEventListener('focusin', onFocusIn);
    area.addEventListener('focusout', onFocusOut);
    show(faceUrl(CENTER_GAZE_KEY));

    return () => {
      area.removeEventListener('pointermove', onPointerMove);
      area.removeEventListener('pointerleave', onPointerLeave);
      area.removeEventListener('focusin', onFocusIn);
      area.removeEventListener('focusout', onFocusOut);
      cancelAnimationFrame(rafId);
      parallax.style.transform = '';
    };
  }, [mode, ready, show, trackingRef]);

  /* Mode tactile : expression brève au tap d'un élément `[data-expression]`. */
  useEffect(() => {
    const area = trackingRef.current;
    if (mode !== 'touch' || !ready || !area) return undefined;

    let timeout: ReturnType<typeof setTimeout> | undefined;
    const onPointerDown = (event: PointerEvent) => {
      const expression = expressionFrom(event.target);
      if (!expression) return;
      show(faceUrl(expressionKey(expression)));
      clearTimeout(timeout);
      timeout = setTimeout(() => show(src), TAP_EXPRESSION_MS);
    };

    area.addEventListener('pointerdown', onPointerDown, { passive: true });
    return () => {
      area.removeEventListener('pointerdown', onPointerDown);
      clearTimeout(timeout);
    };
  }, [mode, ready, show, src, trackingRef]);

  const { previous, current } = layers;

  return (
    <Frame ref={frameRef} data-face-tracker={mode}>
      <Parallax ref={parallaxRef}>
        {/* Image porteuse de l'alt : rendu, SEO et lecteurs d'écran identiques à avant. */}
        <BaseImage src={src} alt={alt} draggable={false} />
        {[previous, current].map((layer) =>
          layer ? (
            <FaceLayer
              key={layer.id}
              src={layer.src}
              alt=""
              aria-hidden="true"
              draggable={false}
              // `initial` n'est lu qu'au montage : une couche devenue « previous » reste opaque.
              initial={layer.id === 0 ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: CROSSFADE_S, ease: 'linear' }}
            />
          ) : null,
        )}
      </Parallax>
    </Frame>
  );
}
