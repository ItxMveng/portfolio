export interface Theme {
  colors: {
    // Backgrounds — système de sections alternées
    bg: string;          // section 1 (blanc / dark profond)
    bgSecondary: string; // section 2 (off-white / dark medium)
    bgTertiary: string;  // section 3 (gris léger / dark léger)
    bgCard: string;
    bgCardHover: string;
    // Surfaces
    surface: string;
    surfaceHover: string;
    surfaceBorder: string;
    surfaceBorderHover: string;
    // Accent orange
    accent: string;
    accentHover: string;
    accentDim: string;
    accentDimHover: string;
    accentGlow: string;
    // Secondaires : blue = mangue, teal = framboise
    blue: string;
    blueDim: string;
    blueGlow: string;
    teal: string;
    tealDim: string;
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
    warm: string;
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
    sans: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
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

/* Thème unique « orange fruité » : crème chaude, mandarine, mangue, framboise. */
export const theme: Theme = {
  ...shared,
  colors: {
    bg: '#FFF8F1',
    bgSecondary: '#FFF0E1',
    bgTertiary: '#FFE6CC',
    bgCard: '#FFFFFF',
    bgCardHover: '#FFFBF6',
    surface: 'rgba(234,88,12,0.045)',
    surfaceHover: 'rgba(234,88,12,0.09)',
    surfaceBorder: 'rgba(154,52,18,0.13)',
    surfaceBorderHover: 'rgba(234,88,12,0.45)',
    accent: '#EA580C',
    accentHover: '#C2410C',
    accentDim: 'rgba(249,115,22,0.12)',
    accentDimHover: 'rgba(249,115,22,0.2)',
    accentGlow: 'rgba(249,115,22,0.38)',
    blue: '#F59E0B',
    blueDim: 'rgba(245,158,11,0.16)',
    blueGlow: 'rgba(245,158,11,0.32)',
    teal: '#DB2777',
    tealDim: 'rgba(219,39,119,0.1)',
    textPrimary: '#2B1408',
    textSecondary: '#5C3A26',
    textMuted: '#86624D',
    textAccent: '#C2410C',
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
    info: '#EA580C',
    calloutInfo: 'rgba(249,115,22,0.08)',
    calloutWarning: 'rgba(245,158,11,0.1)',
    calloutDanger: 'rgba(220,38,38,0.07)',
    calloutTip: 'rgba(219,39,119,0.07)',
    divider: 'rgba(120,53,15,0.09)',
  },
  gradients: {
    brand: 'linear-gradient(135deg, #FF8A1F 0%, #F2600C 55%, #E0356B 100%)',
    warm: 'linear-gradient(135deg, #FFB020 0%, #FF7A1A 100%)',
    soft: 'linear-gradient(135deg, rgba(255,176,32,0.14) 0%, rgba(242,96,12,0.1) 55%, rgba(224,53,107,0.08) 100%)',
  },
  shadows: {
    sm: '0 1px 2px rgba(120,53,15,0.06)',
    md: '0 4px 10px rgba(120,53,15,0.07), 0 2px 4px rgba(120,53,15,0.05)',
    lg: '0 12px 30px rgba(120,53,15,0.1), 0 4px 10px rgba(120,53,15,0.06)',
    card: '0 1px 3px rgba(120,53,15,0.06), 0 6px 18px rgba(120,53,15,0.05)',
    cardHover: '0 14px 40px rgba(234,88,12,0.16), 0 3px 10px rgba(120,53,15,0.07)',
    cardRaised: '0 24px 60px rgba(234,88,12,0.18), 0 8px 22px rgba(120,53,15,0.08)',
    accent: '0 6px 22px rgba(242,96,12,0.3)',
    accentStrong: '0 10px 40px rgba(242,96,12,0.42)',
    glow: '0 0 70px rgba(255,138,31,0.18)',
    blue: '0 4px 20px rgba(245,158,11,0.22)',
  },
};
