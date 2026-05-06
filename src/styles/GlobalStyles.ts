import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

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
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  body {
    background-color: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-family: ${({ theme }) => theme.fonts.sans};
    font-size: ${({ theme }) => theme.fontSizes.base};
    line-height: ${({ theme }) => theme.lineHeights.normal};
    overflow-x: hidden;
    transition: background-color 0.3s ease, color 0.3s ease;
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
    color: ${({ theme }) => theme.colors.accent};
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
    0%   { background-position: 0% 0%;   }
    33%  { background-position: 60% 40%; }
    66%  { background-position: 30% 80%; }
    100% { background-position: 0% 0%;   }
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      ${({ theme }) =>
        theme.isDark
          ? `radial-gradient(ellipse 80% 50% at 20% -5%,  rgba(16,185,129,0.07)  0%, transparent 55%),
             radial-gradient(ellipse 60% 45% at 85% 15%,  rgba(96,165,250,0.06)  0%, transparent 50%),
             radial-gradient(ellipse 55% 50% at 50% 90%,  rgba(45,212,191,0.05)  0%, transparent 50%)`
          : `radial-gradient(ellipse 80% 50% at 20% -5%,  rgba(16,185,129,0.06)  0%, transparent 55%),
             radial-gradient(ellipse 60% 45% at 85% 15%,  rgba(37,99,235,0.04)  0%, transparent 50%),
             radial-gradient(ellipse 55% 50% at 50% 90%,  rgba(13,148,136,0.04)  0%, transparent 50%)`};
    background-size: 200% 200%;
    animation: auroraShift 20s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 0;
    transition: opacity 0.3s ease;
  }

  #root {
    position: relative;
    z-index: 1;
  }

  code:not([class]) {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.875em;
    background: ${({ theme }) => theme.colors.accentDim};
    color: ${({ theme }) => theme.colors.accent};
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
