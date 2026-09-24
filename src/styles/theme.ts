export interface Theme {
  colors: {
    // Fonds — papier chaud, sections alternées
    bg: string;
    bgSecondary: string;
    bgTertiary: string;
    bgCard: string;
    bgCardHover: string;
    // Surfaces
    surface: string;
    surfaceHover: string;
    surfaceBorder: string;
    surfaceBorderHover: string;
    // Accent teal (actions, liens)
    accent: string;
    accentHover: string;
    accentDim: string;
    accentDimHover: string;
    accentGlow: string;
    // Soleil : jaune vif pour aplats et surlignage (jamais en texte sur clair)
    sun: string;
    sunSoft: string;
    // gold : ambre foncé, lisible en texte ; goldDim : fond jaune translucide
    gold: string;
    goldSoft: string;
    goldDim: string;
    goldGlow: string;
    // Corail : touches vives (pastilles, détails) — texte encre dessus
    coral: string;
    coralDim: string;
    // Encre : texte principal et aplats sombres
    ink: string;
    onAccent: string;
    // Textes
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textAccent: string;
    // États
    success: string;
    warning: string;
    danger: string;
    info: string;
    calloutInfo: string;
    calloutWarning: string;
    calloutDanger: string;
    calloutTip: string;
    // Séparateurs
    divider: string;
  };
  fonts: {
    sans: string;
    display: string;
    mono: string;
  };
  fontSizes: {
    xs: string; sm: string; base: string; lg: string; xl: string;
    '2xl': string; '3xl': string; '4xl': string; '5xl': string;
    '6xl': string; '7xl': string;
  };
  fontWeights: {
    normal: number; medium: number; semibold: number; bold: number; extrabold: number;
  };
  lineHeights: {
    tight: number; snug: number; normal: number; relaxed: number;
  };
  spacing: Record<string, string>;
  radii: {
    sm: string; md: string; lg: string; xl: string; '2xl': string; full: string;
  };
  gradients: {
    brand: string;
    gold: string;
    navy: string;
    soft: string;
  };
  shadows: {
    card: string;
    cardHover: string;
    cardRaised: string;
    accent: string;
    accentStrong: string;
    glow: string;
    blue: string;
    sm: string;
    md: string;
    lg: string;
  };
  transitions: {
    fast: string; base: string; slow: string; spring: string;
  };
  breakpoints: {
    sm: string; md: string; lg: string; xl: string; '2xl': string;
  };
  zIndex: {
    base: number; raised: number; dropdown: number;
    sticky: number; overlay: number; modal: number; toast: number;
  };
}

const shared: Omit<Theme, 'colors' | 'shadows' | 'gradients'> = {
  fonts: {
    sans: "'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "'Fraunces', 'Iowan Old Style', Georgia, serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSizes: {
    xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem',
    '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem', '5xl': '3rem',
    '6xl': '3.75rem', '7xl': '4.5rem',
  },
  fontWeights: { normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
  lineHeights: { tight: 1.2, snug: 1.4, normal: 1.6, relaxed: 1.8 },
  spacing: {
    '0': '0', '1': '0.25rem', '2': '0.5rem', '3': '0.75rem', '4': '1rem',
    '5': '1.25rem', '6': '1.5rem', '8': '2rem', '10': '2.5rem',
    '12': '3rem', '16': '4rem', '20': '5rem', '24': '6rem', '32': '8rem',
  },
  radii: { sm: '6px', md: '10px', lg: '16px', xl: '20px', '2xl': '28px', full: '9999px' },
  transitions: {
    fast: '150ms cubic-bezier(0.16,1,0.3,1)',
    base: '250ms cubic-bezier(0.16,1,0.3,1)',
    slow: '400ms cubic-bezier(0.16,1,0.3,1)',
    spring: '500ms cubic-bezier(0.34,1.56,0.64,1)',
  },
  breakpoints: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' },
  zIndex: { base: 0, raised: 10, dropdown: 100, sticky: 200, overlay: 300, modal: 400, toast: 500 },
};

/*
 * Identité : papier chaud + encre + teal profond, avec du jaune soleil en
 * surlignage et une touche de corail. Contrastes vérifiés (WCAG AA) :
 * texte principal 17:1, secondaire 9:1, atténué 6:1, blanc sur teal 5,2:1.
 */
export const theme: Theme = {
  ...shared,
  colors: {
    bg: '#FFFAF1',
    bgSecondary: '#FFF3DF',
    bgTertiary: '#FBE7C4',
    bgCard: '#FFFFFF',
    bgCardHover: '#FFFDF8',
    surface: 'rgba(20,23,31,0.04)',
    surfaceHover: 'rgba(20,23,31,0.08)',
    surfaceBorder: 'rgba(20,23,31,0.14)',
    surfaceBorderHover: 'rgba(11,122,117,0.6)',
    accent: '#0B7A75',
    accentHover: '#08635F',
    accentDim: 'rgba(11,122,117,0.12)',
    accentDimHover: 'rgba(11,122,117,0.2)',
    accentGlow: 'rgba(11,122,117,0.35)',
    sun: '#FFC93C',
    sunSoft: '#FFDD85',
    gold: '#9A4F05',
    goldSoft: '#FFDD85',
    goldDim: 'rgba(255,201,60,0.30)',
    goldGlow: 'rgba(255,201,60,0.45)',
    coral: '#FF6B4A',
    coralDim: 'rgba(255,107,74,0.16)',
    ink: '#14171F',
    onAccent: '#FFFFFF',
    textPrimary: '#14171F',
    textSecondary: '#3F4554',
    textMuted: '#5A6170',
    textAccent: '#08635F',
    success: '#1B7F4B',
    warning: '#9A4F05',
    danger: '#C0392B',
    info: '#0B7A75',
    calloutInfo: 'rgba(11,122,117,0.08)',
    calloutWarning: 'rgba(255,201,60,0.22)',
    calloutDanger: 'rgba(192,57,43,0.08)',
    calloutTip: 'rgba(255,107,74,0.10)',
    divider: 'rgba(20,23,31,0.10)',
  },
  gradients: {
    brand: 'linear-gradient(135deg, #0B7A75 0%, #08635F 100%)',
    gold: 'linear-gradient(135deg, #FFDD85 0%, #FFC93C 100%)',
    navy: 'linear-gradient(160deg, #1D222E 0%, #14171F 100%)',
    soft: 'linear-gradient(135deg, rgba(255,201,60,0.28) 0%, rgba(11,122,117,0.10) 100%)',
  },
  shadows: {
    sm: '0 1px 2px rgba(20,23,31,0.07)',
    md: '0 4px 10px rgba(20,23,31,0.08), 0 2px 4px rgba(20,23,31,0.05)',
    lg: '0 12px 30px rgba(20,23,31,0.12), 0 4px 10px rgba(20,23,31,0.06)',
    card: '0 1px 2px rgba(20,23,31,0.06), 0 6px 16px rgba(120,80,20,0.06)',
    cardHover: '0 14px 34px rgba(120,80,20,0.14), 0 3px 8px rgba(20,23,31,0.08)',
    cardRaised: '0 24px 56px rgba(20,23,31,0.18), 0 8px 20px rgba(20,23,31,0.08)',
    accent: '0 4px 14px rgba(11,122,117,0.28)',
    accentStrong: '0 8px 24px rgba(11,122,117,0.38)',
    glow: '0 0 0 6px rgba(255,201,60,0.28)',
    blue: '0 4px 14px rgba(255,201,60,0.4)',
  },
};
