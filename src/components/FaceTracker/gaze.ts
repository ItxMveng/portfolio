import { GRID_SIZE } from './faceAssets';

/** Fonctions pures (sans DOM) : faciles à tester et à raisonner. */

export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** Part centrale de [-1, 1] ramenée à 0 : le regard reste face caméra. */
export const DEAD_ZONE = 0.08;

/**
 * Distance (px) à partir de laquelle le regard est au maximum. Sans plafond, la
 * photo étant à droite du Hero, il fallait aller tout au bord gauche de l'écran
 * pour voir le visage tourner franchement : le suivi paraissait mou.
 */
export const MAX_REACH = 420;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Normalise un axe sur [-1, 1] autour de `center`. Chaque côté est mis à
 * l'échelle de sa propre distance au bord de la zone (plafonnée à `reach`) :
 * la photo n'étant pas centrée dans le Hero, chaque coin donne bien ±1.
 */
function normalizeAxis(value: number, center: number, min: number, max: number, reach: number): number {
  const delta = value - center;
  const span = Math.min(delta < 0 ? center - min : max - center, reach);
  return span > 0 ? clamp(delta / span, -1, 1) : 0;
}

export function applyDeadZone(value: number, deadZone = DEAD_ZONE): number {
  const magnitude = Math.abs(value);
  if (magnitude <= deadZone) return 0;
  return Math.sign(value) * ((magnitude - deadZone) / (1 - deadZone));
}

/** Position du curseur → direction de regard sur [-1, 1]², zone morte appliquée. */
export function normalizePointer(pointer: Point, anchor: Point, area: Bounds, reach = MAX_REACH): Point {
  return {
    x: applyDeadZone(normalizeAxis(pointer.x, anchor.x, area.left, area.right, reach)),
    y: applyDeadZone(normalizeAxis(pointer.y, anchor.y, area.top, area.bottom, reach)),
  };
}

/** [-1, 1] → index de case [0, GRID_SIZE - 1], cases de largeur égale. */
export function toCellIndex(value: number): number {
  const index = Math.round(((clamp(value, -1, 1) + 1) / 2) * (GRID_SIZE - 1));
  return clamp(index, 0, GRID_SIZE - 1);
}

/** Facteur de lissage exponentiel indépendant de la fréquence d'affichage. */
export function smoothingFactor(deltaMs: number, perFrame = 0.3): number {
  return 1 - Math.pow(1 - perFrame, deltaMs / (1000 / 60));
}
