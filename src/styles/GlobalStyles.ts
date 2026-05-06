import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --scrollbar-width: 0px;
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

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${({ theme }) => theme.colors.bg}; }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.surfaceBorder};
    border-radius: 3px;
    &:hover { background: ${({ theme }) => theme.colors.accent}; }
  }

  ::selection {
    background: ${({ theme }) => theme.colors.accentDim};
    color: ${({ theme }) => theme.colors.accentHover};
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};
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

  .section {
    padding: 5rem 0;

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      padding: 8rem 0;
    }
  }

  @keyframes auroraShift {
    0%   { background-position: 0% 0%;   filter: hue-rotate(0deg); }
    33%  { background-position: 60% 40%; filter: hue-rotate(8deg); }
    66%  { background-position: 30% 80%; filter: hue-rotate(-6deg); }
    100% { background-position: 0% 0%;   filter: hue-rotate(0deg); }
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 90% 60% at 20% -5%,  rgba(249,115,22,0.09)  0%, transparent 55%),
      radial-gradient(ellipse 70% 50% at 85% 15%,  rgba(56,189,248,0.08)  0%, transparent 50%),
      radial-gradient(ellipse 60% 55% at 50% 90%,  rgba(34,211,238,0.06)  0%, transparent 50%),
      radial-gradient(ellipse 80% 40% at 10% 70%,  rgba(249,115,22,0.05)  0%, transparent 50%);
    background-size: 200% 200%;
    animation: auroraShift 20s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 0;
  }

  body::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    background-size: 180px 180px;
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  #root {
    position: relative;
    z-index: 1;
  }

  code:not([class]) {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.875em;
    background: rgba(124,92,252,0.12);
    color: ${({ theme }) => theme.colors.accentHover};
    padding: 0.15em 0.45em;
    border-radius: 4px;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
    border-radius: 4px;
  }

  .page-enter {
    opacity: 0;
    transform: translateY(12px);
  }

  .page-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 400ms ease, transform 400ms ease;
  }

  .page-exit {
    opacity: 1;
  }

  .page-exit-active {
    opacity: 0;
    transition: opacity 200ms ease;
  }
`;
