import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    color-scheme: light;
    --accent: ${({ theme }) => theme.colors.accent};
    --sun: ${({ theme }) => theme.colors.sun};
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
    font-optical-sizing: auto;
    letter-spacing: -0.02em;
  }

  /* Surlignage « feutre » : met en valeur un mot clé d'un titre */
  .marker {
    background-image: linear-gradient(
      transparent 58%,
      ${({ theme }) => theme.colors.sun} 58%,
      ${({ theme }) => theme.colors.sun} 92%,
      transparent 92%
    );
    padding: 0 0.12em;
    margin: 0 -0.12em;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: ${({ theme }) => theme.colors.bg}; }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.surfaceBorder};
    border-radius: 3px;
    &:hover { background: ${({ theme }) => theme.colors.accent}; }
  }

  ::selection {
    background: ${({ theme }) => theme.colors.sun};
    color: ${({ theme }) => theme.colors.ink};
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

  /* Animations */
  @keyframes floatSlow {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50%      { transform: translateY(-14px) rotate(2deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
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
