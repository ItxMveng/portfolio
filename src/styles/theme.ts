export interface Theme {
  isDark: boolean;
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
    // Accent vert
    accent: string;
    accentHover: string;
    accentDim: string;
    accentDimHover: string;
    accentGlow: string;
    // Secondaires
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

const shared: Omit<Theme, 'isDark' | 'colors' | 'shadows'> = {
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

export const lightTheme: Theme = {
  ...shared,
  isDark: false,
  colors: {
    bg: '#ffffff',
    bgSecondary: '#f8fafc',
    bgTertiary: '#f1f5f9',
    bgCard: '#ffffff',
    bgCardHover: '#f8fafc',
    surface: 'rgba(0,0,0,0.03)',
    surfaceHover: 'rgba(0,0,0,0.055)',
    surfaceBorder: 'rgba(0,0,0,0.07)',
    surfaceBorderHover: 'rgba(5,150,105,0.4)',
    accent: '#059669',
    accentHover: '#047857',
    accentDim: 'rgba(5,150,105,0.09)',
    accentDimHover: 'rgba(5,150,105,0.16)',
    accentGlow: 'rgba(5,150,105,0.28)',
    blue: '#2563EB',
    blueDim: 'rgba(37,99,235,0.08)',
    blueGlow: 'rgba(37,99,235,0.2)',
    teal: '#0D9488',
    tealDim: 'rgba(13,148,136,0.09)',
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    textAccent: '#059669',
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626',
    info: '#2563EB',
    calloutInfo: 'rgba(37,99,235,0.06)',
    calloutWarning: 'rgba(217,119,6,0.06)',
    calloutDanger: 'rgba(220,38,38,0.06)',
    calloutTip: 'rgba(13,148,136,0.06)',
    divider: 'rgba(15,23,42,0.06)',
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.04)',
    md: '0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)',
    lg: '0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.05)',
    card: '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04)',
    cardHover: '0 8px 30px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)',
    cardRaised: '0 20px 60px rgba(0,0,0,0.12), 0 6px 20px rgba(0,0,0,0.07)',
    accent: '0 4px 20px rgba(5,150,105,0.18)',
    accentStrong: '0 8px 40px rgba(5,150,105,0.3)',
    glow: '0 0 60px rgba(5,150,105,0.08)',
    blue: '0 4px 20px rgba(37,99,235,0.12)',
  },
};

export const darkTheme: Theme = {
  ...shared,
  isDark: true,
  colors: {
    bg: '#0f172a',
    bgSecondary: '#131f35',
    bgTertiary: '#1a2744',
    bgCard: '#1e293b',
    bgCardHover: '#243350',
    surface: 'rgba(255,255,255,0.04)',
    surfaceHover: 'rgba(255,255,255,0.07)',
    surfaceBorder: 'rgba(255,255,255,0.08)',
    surfaceBorderHover: 'rgba(16,185,129,0.45)',
    accent: '#10B981',
    accentHover: '#34D399',
    accentDim: 'rgba(16,185,129,0.12)',
    accentDimHover: 'rgba(16,185,129,0.22)',
    accentGlow: 'rgba(16,185,129,0.38)',
    blue: '#60A5FA',
    blueDim: 'rgba(96,165,250,0.1)',
    blueGlow: 'rgba(96,165,250,0.3)',
    teal: '#2DD4BF',
    tealDim: 'rgba(45,212,191,0.1)',
    textPrimary: '#e2e8f0',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    textAccent: '#34D399',
    success: '#10B981',
    warning: '#FBBF24',
    danger: '#F87171',
    info: '#60A5FA',
    calloutInfo: 'rgba(96,165,250,0.07)',
    calloutWarning: 'rgba(251,191,36,0.07)',
    calloutDanger: 'rgba(248,113,113,0.07)',
    calloutTip: 'rgba(45,212,191,0.07)',
    divider: 'rgba(255,255,255,0.06)',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.3)',
    md: '0 4px 12px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.2)',
    lg: '0 12px 40px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)',
    card: '0 2px 8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
    cardHover: '0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(16,185,129,0.18)',
    cardRaised: '0 24px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(16,185,129,0.25)',
    accent: '0 4px 20px rgba(16,185,129,0.22)',
    accentStrong: '0 8px 40px rgba(16,185,129,0.38)',
    glow: '0 0 80px rgba(16,185,129,0.1)',
    blue: '0 4px 20px rgba(96,165,250,0.15)',
  },
};

export const theme = lightTheme;
