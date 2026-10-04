import { FACE_SET } from './faceSet.generated';

/**
 * Catalogue des images du <FaceTracker />.
 * Source de vérité partagée avec `scripts/generate-faces.ts` : ajouter une
 * expression ici puis relancer le script suffit à la rendre disponible.
 */

/** Grille de regard GRID_SIZE × GRID_SIZE ; la case centrale = face caméra. */
export const GRID_SIZE = 5;
export const GRID_CENTER = Math.floor(GRID_SIZE / 2);

export const EXPRESSIONS = [
  'smile',
  'big-smile',
  'wink',
  'surprised',
  'raised-eyebrow',
  'neutral',
] as const;

export type Expression = (typeof EXPRESSIONS)[number];
export type GazeKey = `gaze_${number}_${number}`;
export type ExpressionKey = `expr_${Expression}`;
export type FaceKey = GazeKey | ExpressionKey;

export function isExpression(value: string | null | undefined): value is Expression {
  return value != null && (EXPRESSIONS as readonly string[]).includes(value);
}

/** row = axe vertical (0 = haut), col = axe horizontal (0 = gauche de l'écran). */
export function gazeKey(row: number, col: number): GazeKey {
  return `gaze_${row}_${col}`;
}

export function expressionKey(expression: Expression): ExpressionKey {
  return `expr_${expression}`;
}

export const CENTER_GAZE_KEY = gazeKey(GRID_CENTER, GRID_CENTER);

export const GAZE_KEYS: GazeKey[] = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) =>
  gazeKey(Math.floor(i / GRID_SIZE), i % GRID_SIZE),
);

export const EXPRESSION_KEYS: ExpressionKey[] = EXPRESSIONS.map(expressionKey);

export const FACE_DIR = '/face';

/** `?v=` invalide le cache navigateur à chaque régénération du jeu d'images. */
export function faceUrl(key: FaceKey): string {
  return `${FACE_DIR}/${key}.webp?v=${FACE_SET.version}`;
}

/**
 * Le jeu d'images a été généré à partir d'une photo précise. Si l'avatar est
 * changé depuis l'admin, on ne veut pas afficher l'ancien visage : le suivi se
 * désactive et la nouvelle photo s'affiche en statique.
 */
export function isFaceSetFor(src: string): boolean {
  return FACE_SET.sources.some((source) => source === src);
}
