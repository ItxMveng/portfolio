import styled from 'styled-components';

/* Couverture typographique générée pour les projets sans capture d'écran.
   Volontairement abstraite : elle ne prétend jamais montrer le produit. */

const PALETTES = [
  { bg: '#0B7A75', fg: '#FFFAF1', a: '#FFC93C', b: '#FF6B4A' },
  { bg: '#FFC93C', fg: '#14171F', a: '#0B7A75', b: '#FF6B4A' },
  { bg: '#14171F', fg: '#FFFAF1', a: '#FFC93C', b: '#0B7A75' },
  { bg: '#FF6B4A', fg: '#14171F', a: '#FFC93C', b: '#14171F' },
] as const;

function paletteFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTES[h % PALETTES.length];
}

const Wrap = styled.div<{ $bg: string; $fg: string }>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 1.1rem 1.25rem;
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
`;

const ShapeA = styled.span<{ $c: string }>`
  position: absolute;
  top: -32%;
  right: -10%;
  width: 62%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: ${({ $c }) => $c};
`;

const ShapeB = styled.span<{ $c: string }>`
  position: absolute;
  left: 8%;
  top: 14%;
  width: 14%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: ${({ $c }) => $c};
`;

const Name = styled.span<{ $long: boolean }>`
  position: relative;
  z-index: 1;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: ${({ $long }) => ($long ? 'clamp(1.4rem, 3.4vw, 2rem)' : 'clamp(1.9rem, 4.6vw, 2.75rem)')};
  letter-spacing: -0.03em;
  line-height: 1;
`;

export function ProjectCoverArt({
  title,
  seed,
  showName = true,
}: {
  title: string;
  seed?: string;
  showName?: boolean;
}) {
  const name = title.split(' — ')[0].trim();
  const p = paletteFor(seed ?? title);
  return (
    <Wrap $bg={p.bg} $fg={p.fg} role="img" aria-label={`Couverture du projet ${name}`}>
      <ShapeA $c={p.a} />
      <ShapeB $c={p.b} />
      {showName && <Name $long={name.length > 14}>{name}</Name>}
    </Wrap>
  );
}
