import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    color-scheme: light;
    --accent: ${({ theme }) => theme.colors.accent};
    --gold: ${({ theme }) => theme.colors.gold};
    --color-text-primary: ${({ theme }) => theme.colors.textPrimary};
    --color-text-secondary: ${({ theme }) => theme.colors.textSecondary};
    --color-text-muted: ${({ theme }) => theme.colors.textMuted};
    --color-bg-card: ${({ theme }) => theme.colors.bgCard};
    --color-surface-border: ${({ theme }) => theme.colors.surfaceBorder};
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    background-color: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: ${({ theme }) => theme.fontSizes.base};
    line-height: ${({ theme }) => theme.lineHeights.normal};
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.display};
    letter-spacing: -0.015em;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: ${({ theme }) => theme.colors.bg}; }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.surfaceBorder};
    border-radius: 3px;
    &:hover { background: ${({ theme }) => theme.colors.accent}; }
  }

  ::selection {
    background: ${({ theme }) => theme.colors.accentDim};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img, video {
    max-width: 100%;
    height: auto;
    display: block;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
    font-size: inherit;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    outline: none;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      padding: 0 2rem;
    }
  }

  /* Séparateurs de section graphiques */
  .section-divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      ${({ theme }) => theme.colors.divider} 20%,
      ${({ theme }) => theme.colors.divider} 80%,
      transparent
    );
  }

  code:not([class]) {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.875em;
    background: ${({ theme }) => theme.colors.accentDim};
    color: ${({ theme }) => theme.colors.textAccent};
    padding: 0.15em 0.45em;
    border-radius: 4px;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
    border-radius: 4px;
  }

  /* Blobs graphiques réutilisables */
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    opacity: 0.16;
  }

  .blob-green {
    background: radial-gradient(circle, ${({ theme }) => theme.colors.accent}, transparent 70%);
  }

  .blob-blue {
    background: radial-gradient(circle, ${({ theme }) => theme.colors.gold}, transparent 70%);
  }

  /* Animations */
  @keyframes blobFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(-20px, 15px) scale(1.04); }
    66%       { transform: translate(15px, -10px) scale(0.97); }
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes lineGrow {
    from { transform: scaleY(0); opacity: 0; }
    to   { transform: scaleY(1); opacity: 1; }
  }

  /* Page transitions */
  .page-enter {
    opacity: 0;
    transform: translateY(10px);
  }
  .page-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 350ms ease, transform 350ms ease;
  }
  .page-exit { opacity: 1; }
  .page-exit-active {
    opacity: 0;
    transition: opacity 200ms ease;
  }
`;
