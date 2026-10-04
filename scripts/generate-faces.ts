/**
 * Génère le jeu d'images du composant <FaceTracker /> dans `public/face/`.
 *
 *   gaze_{row}_{col}.webp  grille 7×7 de directions du regard / de la tête
 *                          (row 0 = regarde en haut, col 0 = regarde vers la gauche de l'écran)
 *   expr_{name}.webp       expressions : smile, big-smile, wink, surprised, raised-eyebrow, neutral
 *
 * Toutes les images : WebP 480×480, qualité 80, même cadrage carré centré que la
 * photo actuelle (équivalent du `object-fit: cover` du Hero).
 *
 * ── Usage ────────────────────────────────────────────────────────────────────
 *   # Génération réelle via Replicate (modèle fofr/expression-editor, ~31 prédictions)
 *   REPLICATE_API_TOKEN=r8_xxx npm run faces:generate
 *
 *   # 1er lancement conseillé : calibrer le sens du regard (3 prédictions seulement)
 *   REPLICATE_API_TOKEN=r8_xxx npm run faces:generate -- --only gaze_0_0,gaze_3_0,gaze_6_6 --force
 *   → gaze_0_0 / gaze_3_0 : tête ET yeux vers la GAUCHE de l'écran (haut / milieu),
 *     gaze_6_6 vers le BAS à DROITE.
 *     Sinon, inverser le signe concerné dans SIGN ci-dessous.
 *
 *   # Images de test sans Replicate (décalages de cadrage sur la photo d'origine)
 *   npm run faces:generate -- --placeholder
 *
 *   # Contrôle de cohérence seul (dimensions, éclairage, cadrage, poids total)
 *   npm run faces:generate -- --check
 *
 * Options :
 *   --source <chemin|url>   photo d'origine (défaut : public/francis-itoua.jpg)
 *   --source-url <url>      URL sous laquelle le site affiche cette photo (répétable).
 *                           Le composant ne s'active que si `profile.avatar_url` en fait
 *                           partie : changer l'avatar dans l'admin désactive proprement le suivi.
 *   --only <k1,k2>          ne (re)génère que ces clés (ex. gaze_0_0,expr_wink)
 *   --force                 écrase les fichiers existants (sinon ils sont conservés)
 *   --concurrency <n>       prédictions Replicate en parallèle (défaut : 3)
 *
 * Le script réécrit aussi `src/components/FaceTracker/faceSet.generated.ts`
 * (version = hash du contenu, pour invalider le cache navigateur).
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {
  CENTER_GAZE_KEY,
  EXPRESSION_KEYS,
  GAZE_KEYS,
  GRID_CENTER,
  type Expression,
  type FaceKey,
} from '../src/components/FaceTracker/faceAssets';
import { FACE_SET } from '../src/components/FaceTracker/faceSet.generated';

/* ── Configuration ─────────────────────────────────────────────────────────── */

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'public', 'face');
const MANIFEST_FILE = path.join(ROOT, 'src', 'components', 'FaceTracker', 'faceSet.generated.ts');

const DEFAULT_SOURCE = path.join(ROOT, 'public', 'francis-itoua.jpg');
/** URLs actuelles de cette photo sur le site (fichier du repo + avatar Supabase de l'admin). */
const DEFAULT_SOURCE_URLS = [
  '/francis-itoua.jpg',
  'https://nsscebubijinfnoxwtgm.supabase.co/storage/v1/object/public/media/avatars/1774216175092-98lb0bj3hak.jpg',
];

/** Affichée jusqu'à 216 px (× 2 en écran Retina) : 480 px garde la photo nette. */
const OUTPUT_SIZE = 480;
const WEBP_QUALITY = 80;
/** Taille envoyée à Replicate : assez de détail pour le visage, data URI léger. */
const REPLICATE_INPUT_SIZE = 768;
const REPLICATE_MODEL = 'fofr/expression-editor';
const MAX_TOTAL_BYTES = 2 * 1024 * 1024;

type SharpPipeline = ReturnType<typeof sharp>;
type ChannelStats = Awaited<ReturnType<SharpPipeline['stats']>>['channels'];

/**
 * Amplitudes aux bords de la grille (plages du modèle : pupilles ±15, rotations ±20).
 * Assez marquées pour que le suivi du regard se lise, sans déformer le visage.
 */
const GAZE_RANGE = { pupil: 14, yaw: 15, pitch: 10 };

/**
 * Conventions de signe du modèle (LivePortrait). t < 0 = gauche / haut de l'écran.
 * Vérifiées visuellement : rotate_yaw > 0 tourne la tête vers la gauche de l'image
 * (un yaw de signe opposé aux pupilles donnait un effet miroir).
 */
const SIGN = { pupilX: 1, pupilY: -1, yaw: 1, pitch: 1 };

type ModelInput = Partial<
  Record<
    | 'rotate_pitch' | 'rotate_yaw' | 'rotate_roll'
    | 'blink' | 'eyebrow' | 'wink'
    | 'pupil_x' | 'pupil_y'
    | 'aaa' | 'eee' | 'woo' | 'smile',
    number
  >
>;

const EXPRESSION_PARAMS: Record<Expression, ModelInput> = {
  neutral: {},
  smile: { smile: 0.7 },
  'big-smile': { smile: 1.2, eyebrow: 2, aaa: 12 },
  wink: { wink: 18, smile: 0.5 },
  surprised: { eyebrow: 12, aaa: 40 },
  'raised-eyebrow': { eyebrow: 9, smile: 0.25, rotate_roll: -3 },
};

/* ── Arguments ─────────────────────────────────────────────────────────────── */

interface Options {
  mode: 'replicate' | 'placeholder' | 'check';
  source: string;
  sourceUrls: string[];
  only: Set<FaceKey> | null;
  force: boolean;
  concurrency: number;
}

const ALL_KEYS: FaceKey[] = [...GAZE_KEYS, ...EXPRESSION_KEYS];

function parseArgs(argv: string[]): Options {
  const options: Options = {
    mode: 'replicate',
    source: DEFAULT_SOURCE,
    sourceUrls: [...DEFAULT_SOURCE_URLS],
    only: null,
    force: false,
    concurrency: 3,
  };
  const customUrls: string[] = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      const value = argv[i + 1];
      if (value === undefined) throw new Error(`Valeur manquante pour ${arg}`);
      i += 1;
      return value;
    };
    switch (arg) {
      case '--placeholder': options.mode = 'placeholder'; break;
      case '--check': options.mode = 'check'; break;
      case '--force': options.force = true; break;
      case '--source': options.source = next(); break;
      case '--source-url': customUrls.push(next()); break;
      case '--concurrency': options.concurrency = Math.max(1, Number(next()) || 1); break;
      case '--only': {
        const keys = next().split(',').map((k) => k.trim()).filter(Boolean);
        const unknown = keys.filter((k) => !ALL_KEYS.includes(k as FaceKey));
        if (unknown.length) throw new Error(`Clés inconnues : ${unknown.join(', ')}`);
        options.only = new Set(keys as FaceKey[]);
        break;
      }
      default: throw new Error(`Option inconnue : ${arg}`);
    }
  }
  // Une source personnalisée sans --source-url : on ne présume pas de son URL publique.
  if (options.source !== DEFAULT_SOURCE) options.sourceUrls = [];
  options.sourceUrls.push(...customUrls);
  return options;
}

/* ── Image source ──────────────────────────────────────────────────────────── */

async function loadSource(source: string): Promise<Buffer> {
  if (/^https?:\/\//.test(source)) {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`Téléchargement de la source impossible (${res.status})`);
    return Buffer.from(await res.arrayBuffer());
  }
  return readFile(path.resolve(source));
}

/** Carré centré, identique au rendu `object-fit: cover` de la photo actuelle. */
async function squareRegion(image: Buffer) {
  const { width = 0, height = 0 } = await sharp(image).rotate().metadata();
  const size = Math.min(width, height);
  return {
    size,
    left: Math.floor((width - size) / 2),
    top: Math.floor((height - size) / 2),
  };
}

function toWebp(pipeline: SharpPipeline): Promise<Buffer> {
  return pipeline
    .resize(OUTPUT_SIZE, OUTPUT_SIZE, { fit: 'cover' })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
}

/** t ∈ [-1, 1] pour un index de grille (0 → -1, centre → 0, bord → 1). */
const gridT = (index: number) => (index - GRID_CENTER) / GRID_CENTER;

function parseGazeKey(key: FaceKey): { row: number; col: number } | null {
  const match = /^gaze_(\d+)_(\d+)$/.exec(key);
  return match ? { row: Number(match[1]), col: Number(match[2]) } : null;
}

/* ── Mode placeholder ──────────────────────────────────────────────────────── */

async function renderPlaceholder(key: FaceKey, image: Buffer): Promise<Buffer> {
  const { size, left, top } = await squareRegion(image);
  const base = sharp(image).rotate();

  const gaze = parseGazeKey(key);
  if (gaze) {
    // Fenêtre de cadrage légèrement réduite puis décalée : le visage « glisse »
    // vers la direction du regard (la fenêtre part dans le sens opposé).
    const window = Math.round(size * 0.94);
    const maxShift = Math.floor((size - window) / 2);
    const offsetX = maxShift - Math.round(gridT(gaze.col) * maxShift);
    const offsetY = maxShift - Math.round(gridT(gaze.row) * maxShift);
    return toWebp(base.extract({ left: left + offsetX, top: top + offsetY, width: window, height: window }));
  }

  const square = await base.extract({ left, top, width: size, height: size }).toBuffer();
  const expression = key.replace(/^expr_/, '') as Expression;
  switch (expression) {
    case 'smile':
      return toWebp(sharp(square).modulate({ brightness: 1.05 }));
    case 'big-smile':
      return toWebp(sharp(square).modulate({ brightness: 1.08, saturation: 1.15 }));
    case 'wink':
      return toWebp(sharp(await sharp(square).rotate(4, { background: '#ffffff' }).toBuffer()));
    case 'raised-eyebrow':
      return toWebp(sharp(await sharp(square).rotate(-4, { background: '#ffffff' }).toBuffer()));
    case 'surprised': {
      const crop = Math.round(size * 0.9);
      const inset = Math.floor((size - crop) / 2);
      return toWebp(sharp(square).extract({ left: inset, top: inset, width: crop, height: crop }));
    }
    case 'neutral':
    default:
      return toWebp(sharp(square));
  }
}

/* ── Mode Replicate ────────────────────────────────────────────────────────── */

interface Prediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: string | string[] | null;
  error?: string | null;
  urls: { get: string };
}

interface ModelInfo {
  latest_version?: {
    id: string;
    openapi_schema?: { components?: { schemas?: { Input?: { properties?: Record<string, unknown> } } } };
  };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Erreur qui ne se résout pas en réessayant (crédit épuisé, token invalide) : on arrête tout. */
class FatalError extends Error {}

class ReplicateClient {
  constructor(private readonly token: string) {}

  private async request<T>(url: string, init: RequestInit = {}): Promise<T> {
    // Sans moyen de paiement, Replicate limite à ~6 prédictions/min : on attend `retry_after`.
    for (let throttled = 0; ; throttled += 1) {
      const res = await fetch(url.startsWith('http') ? url : `https://api.replicate.com/v1${url}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          ...init.headers,
        },
      });
      if (res.ok) return (await res.json()) as T;
      const body = await res.text();
      if (res.status === 429 && throttled < 20) {
        const retryAfter = Number((JSON.parse(body) as { retry_after?: number }).retry_after) || 10;
        await sleep((retryAfter + 1) * 1000);
        continue;
      }
      if (res.status === 401 || res.status === 402) {
        throw new FatalError(
          res.status === 402
            ? 'Crédit Replicate insuffisant : ajoutez du crédit sur https://replicate.com/account/billing puis relancez.'
            : 'REPLICATE_API_TOKEN invalide (401).',
        );
      }
      throw new Error(`Replicate ${res.status} : ${body}`);
    }
  }

  async latestVersion(model: string) {
    const info = await this.request<ModelInfo>(`/models/${model}`);
    const version = info.latest_version;
    if (!version) throw new Error(`Aucune version publiée pour ${model}`);
    const inputProps = version.openapi_schema?.components?.schemas?.Input?.properties;
    return { id: version.id, inputNames: inputProps ? new Set(Object.keys(inputProps)) : null };
  }

  async run(version: string, input: Record<string, unknown>): Promise<Buffer> {
    let prediction = await this.request<Prediction>('/predictions', {
      method: 'POST',
      headers: { Prefer: 'wait=60' },
      body: JSON.stringify({ version, input }),
    });
    while (prediction.status === 'starting' || prediction.status === 'processing') {
      await sleep(1500);
      prediction = await this.request<Prediction>(prediction.urls.get);
    }
    if (prediction.status !== 'succeeded') {
      throw new Error(`Prédiction ${prediction.id} : ${prediction.status} ${prediction.error ?? ''}`);
    }
    const outputUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
    if (!outputUrl) throw new Error(`Prédiction ${prediction.id} sans sortie`);
    const res = await fetch(outputUrl);
    if (!res.ok) throw new Error(`Téléchargement de la sortie impossible (${res.status})`);
    return Buffer.from(await res.arrayBuffer());
  }
}

function modelInputFor(key: FaceKey): ModelInput {
  const gaze = parseGazeKey(key);
  if (!gaze) return EXPRESSION_PARAMS[key.replace(/^expr_/, '') as Expression];
  const tx = gridT(gaze.col);
  const ty = gridT(gaze.row);
  const round = (n: number) => Math.round(n * 100) / 100 || 0;
  return {
    pupil_x: round(tx * GAZE_RANGE.pupil * SIGN.pupilX),
    pupil_y: round(ty * GAZE_RANGE.pupil * SIGN.pupilY),
    rotate_yaw: round(tx * GAZE_RANGE.yaw * SIGN.yaw),
    rotate_pitch: round(ty * GAZE_RANGE.pitch * SIGN.pitch),
  };
}

async function generateWithReplicate(keys: FaceKey[], image: Buffer, options: Options) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error(
      'REPLICATE_API_TOKEN absent. Ajoutez-le à l\'environnement, ou lancez `npm run faces:generate -- --placeholder`.',
    );
  }
  const client = new ReplicateClient(token);
  const version = await client.latestVersion(REPLICATE_MODEL);
  console.log(`Modèle ${REPLICATE_MODEL} @ ${version.id.slice(0, 12)}`);

  const { size, left, top } = await squareRegion(image);
  const input = await sharp(image)
    .rotate()
    .extract({ left, top, width: size, height: size })
    .resize(REPLICATE_INPUT_SIZE, REPLICATE_INPUT_SIZE)
    .jpeg({ quality: 90 })
    .toBuffer();
  const imageDataUri = `data:image/jpeg;base64,${input.toString('base64')}`;

  await runPool(keys, options.concurrency, async (key) => {
    const params = modelInputFor(key);
    const unknown = version.inputNames
      ? Object.keys(params).filter((name) => !version.inputNames?.has(name))
      : [];
    if (unknown.length) throw new Error(`Paramètres refusés par le modèle : ${unknown.join(', ')}`);

    let lastError: unknown;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const output = await client.run(version.id, {
          image: imageDataUri,
          ...params,
          output_format: 'png',
        });
        await writeFile(path.join(OUTPUT_DIR, `${key}.webp`), await toWebp(sharp(output)));
        console.log(`  ✓ ${key}  ${JSON.stringify(params)}`);
        return;
      } catch (error) {
        if (error instanceof FatalError) throw error;
        lastError = error;
        console.warn(`  … ${key} tentative ${attempt} échouée : ${String(error)}`);
        await sleep(2000 * attempt);
      }
    }
    throw lastError;
  });
}

async function runPool<T>(items: T[], concurrency: number, worker: (item: T) => Promise<void>) {
  const queue = [...items];
  const failures: unknown[] = [];
  await Promise.all(
    Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
      for (let item = queue.shift(); item !== undefined; item = queue.shift()) {
        try {
          await worker(item);
        } catch (error) {
          if (error instanceof FatalError) {
            queue.length = 0;
            throw error;
          }
          failures.push(error);
        }
      }
    }),
  );
  if (failures.length) throw new Error(`${failures.length} image(s) en échec, relancez le script (les réussies sont conservées).`);
}

/* ── Contrôle de cohérence ─────────────────────────────────────────────────── */

interface ImageStats {
  luminance: number;
  /** Bande haute de l'image (fond) : révèle un recadrage ou un changement d'éclairage. */
  background: number;
}

async function imageStats(file: string): Promise<ImageStats> {
  const lum = (channels: ChannelStats) =>
    0.2126 * channels[0].mean + 0.7152 * channels[1].mean + 0.0722 * channels[2].mean;
  const full = await sharp(file).stats();
  const band = await sharp(file)
    .extract({ left: 0, top: 0, width: OUTPUT_SIZE, height: Math.round(OUTPUT_SIZE * 0.12) })
    .stats();
  return { luminance: lum(full.channels), background: lum(band.channels) };
}

async function checkConsistency(): Promise<boolean> {
  let ok = true;
  let totalBytes = 0;
  const reference = await imageStats(path.join(OUTPUT_DIR, `${CENTER_GAZE_KEY}.webp`)).catch(() => null);
  if (!reference) {
    console.error(`✗ Image de référence ${CENTER_GAZE_KEY}.webp manquante`);
    return false;
  }

  for (const key of ALL_KEYS) {
    const file = path.join(OUTPUT_DIR, `${key}.webp`);
    if (!existsSync(file)) {
      console.error(`✗ ${key}.webp manquant`);
      ok = false;
      continue;
    }
    const buffer = await readFile(file);
    totalBytes += buffer.length;
    const meta = await sharp(buffer).metadata();
    if (meta.format !== 'webp' || meta.width !== OUTPUT_SIZE || meta.height !== OUTPUT_SIZE) {
      console.error(`✗ ${key}.webp : ${meta.format} ${meta.width}×${meta.height} (attendu webp ${OUTPUT_SIZE}×${OUTPUT_SIZE})`);
      ok = false;
    }
    const stats = await imageStats(file);
    const dLum = Math.abs(stats.luminance - reference.luminance);
    const dBg = Math.abs(stats.background - reference.background);
    if (dLum > 12 || dBg > 14) {
      console.warn(`⚠ ${key} : écart d'éclairage/cadrage (Δlum ${dLum.toFixed(1)}, Δfond ${dBg.toFixed(1)}) — à vérifier visuellement`);
    }
  }

  const extra = (await readdir(OUTPUT_DIR)).filter(
    (name) => name.endsWith('.webp') && !ALL_KEYS.includes(name.replace(/\.webp$/, '') as FaceKey),
  );
  if (extra.length) console.warn(`⚠ Fichiers inattendus dans public/face : ${extra.join(', ')}`);

  const mb = (totalBytes / 1024 / 1024).toFixed(2);
  if (totalBytes > MAX_TOTAL_BYTES) console.warn(`⚠ Poids total ${mb} Mo (> 2 Mo)`);
  console.log(`${ok ? '✓' : '✗'} ${ALL_KEYS.length} images attendues, poids total ${mb} Mo`);
  return ok;
}

/* ── Manifest ──────────────────────────────────────────────────────────────── */

async function writeManifest(sources: string[], placeholder: boolean) {
  const hash = createHash('sha256');
  for (const key of ALL_KEYS) {
    const file = path.join(OUTPUT_DIR, `${key}.webp`);
    if (existsSync(file)) hash.update(await readFile(file));
  }
  const manifest = {
    version: hash.digest('hex').slice(0, 10),
    placeholder,
    sources: [...new Set(sources)],
  };
  const content = `// Fichier généré par scripts/generate-faces.ts — ne pas éditer à la main.
export const FACE_SET: {
  /** Hash du contenu de public/face (cache-busting). */
  readonly version: string;
  /** true tant que les images sont des placeholders (pas encore générées par Replicate). */
  readonly placeholder: boolean;
  /** URLs de la photo d'origine : le suivi ne s'active que si l'avatar affiché en fait partie. */
  readonly sources: readonly string[];
} = ${JSON.stringify(manifest, null, 2).replace(/"(\w+)":/g, '$1:').replace(/"/g, "'")};
`;
  await writeFile(MANIFEST_FILE, content);
  console.log(`Manifest écrit (version ${manifest.version}${placeholder ? ', placeholders' : ''})`);
}

/* ── Main ──────────────────────────────────────────────────────────────────── */

async function main() {
  const options = parseArgs(process.argv.slice(2));
  await mkdir(OUTPUT_DIR, { recursive: true });

  if (options.mode === 'check') {
    process.exitCode = (await checkConsistency()) ? 0 : 1;
    return;
  }

  const image = await loadSource(options.source);
  const keys = ALL_KEYS.filter(
    (key) =>
      (!options.only || options.only.has(key)) &&
      (options.force || options.only?.has(key) || !existsSync(path.join(OUTPUT_DIR, `${key}.webp`))),
  );
  console.log(`${keys.length} image(s) à générer (${options.mode})`);

  if (options.mode === 'placeholder') {
    for (const key of keys) {
      await writeFile(path.join(OUTPUT_DIR, `${key}.webp`), await renderPlaceholder(key, image));
    }
  } else {
    await generateWithReplicate(keys, image, options);
  }

  // Une génération partielle ne change pas la nature du reste du jeu d'images.
  const placeholder =
    options.mode === 'placeholder' || (keys.length < ALL_KEYS.length && FACE_SET.placeholder);
  await writeManifest(options.sourceUrls, placeholder);
  const ok = await checkConsistency();
  if (!ok) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
