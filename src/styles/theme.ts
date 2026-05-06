export interface Theme {
  isDark: boolean;
  colors: {
    bg: string;
    bgSecondary: string;
    bgCard: string;
    bgCardHover: string;
    surface: string;
    surfaceHover: string;
    surfaceBorder: string;
    surfaceBorderHover: string;
    accent: string;
    accentHover: string;
    accentDim: string;
    accentDimHover: string;
    accentGlow: string;
    blue: string;
    blueDim: string;
    blueGlow: string;
    teal: string;
    tealDim: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textAccent: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    calloutInfo: string;
    calloutWarning: string;
    calloutDanger: string;
    calloutTip: string;
  };
  fonts: {
    sans: string;
    mono: string;
  };
  fontSizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
    '7xl': string;
  };
  fontWeights: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeights: {
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
  };
  spacing: Record<string, string>;
  radii: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    full: string;
  };
  shadows: {
    card: string;
    cardHover: string;
    accent: string;
    accentStrong: string;
    glow: string;
    blue: string;
  };
  transitions: {
    fast: string;
    base: string;
    slow: string;
    spring: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  zIndex: {
    base: number;
    raised: number;
    dropdown: number;
    sticky: number;
    overlay: number;
    modal: number;
    toast: number;
  };
}

const shared: Omit<Theme, 'isDark' | 'colors' | 'shadows'> = {
  fonts: {
    sans: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeights: {
    tight: 1.2,
    snug: 1.4,
    normal: 1.6,
    relaxed: 1.8,
  },
  spacing: {
    '0': '0',
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '8': '2rem',
    '10': '2.5rem',
    '12': '3rem',
    '16': '4rem',
    '20': '5rem',
    '24': '6rem',
    '32': '8rem',
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    full: '9999px',
  },
  transitions: {
    fast: '150ms ease',
    base: '250ms ease',
    slow: '400ms ease',
    spring: '500ms cubic-bezier(0.34,1.56,0.64,1)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  zIndex: {
    base: 0,
    raised: 10,
    dropdown: 100,
    sticky: 200,
    overlay: 300,
    modal: 400,
    toast: 500,
  },
};

export const lightTheme: Theme = {
  ...shared,
  isDark: false,
  colors: {
    bg: '#f9fafb',
    bgSecondary: '#f3f4f6',
    bgCard: '#ffffff',
    bgCardHover: '#f9fafb',
    surface: 'rgba(0,0,0,0.03)',
    surfaceHover: 'rgba(0,0,0,0.06)',
    surfaceBorder: 'rgba(0,0,0,0.08)',
    surfaceBorderHover: 'rgba(16,185,129,0.4)',
    accent: '#059669',
    accentHover: '#10B981',
    accentDim: 'rgba(16,185,129,0.1)',
    accentDimHover: 'rgba(16,185,129,0.18)',
    accentGlow: 'rgba(16,185,129,0.35)',
    blue: '#2563EB',
    blueDim: 'rgba(37,99,235,0.1)',
    blueGlow: 'rgba(37,99,235,0.25)',
    teal: '#0D9488',
    tealDim: 'rgba(13,148,136,0.1)',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    textAccent: '#059669',
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626',
    info: '#2563EB',
    calloutInfo: 'rgba(37,99,235,0.06)',
    calloutWarning: 'rgba(217,119,6,0.06)',
    calloutDanger: 'rgba(220,38,38,0.06)',
    calloutTip: 'rgba(13,148,136,0.06)',
  },
  shadows: {
    card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    cardHover: '0 10px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)',
    accent: '0 0 32px rgba(16,185,129,0.15)',
    accentStrong: '0 0 56px rgba(16,185,129,0.28)',
    glow: '0 0 80px rgba(16,185,129,0.08)',
    blue: '0 0 32px rgba(37,99,235,0.12)',
  },
};

export const darkTheme: Theme = {
  ...shared,
  isDark: true,
  colors: {
    bg: '#0a0f1e',
    bgSecondary: '#0f1628',
    bgCard: '#131d30',
    bgCardHover: '#1a2640',
    surface: 'rgba(255,255,255,0.04)',
    surfaceHover: 'rgba(255,255,255,0.07)',
    surfaceBorder: 'rgba(255,255,255,0.08)',
    surfaceBorderHover: 'rgba(16,185,129,0.4)',
    accent: '#10B981',
    accentHover: '#34D399',
    accentDim: 'rgba(16,185,129,0.12)',
    accentDimHover: 'rgba(16,185,129,0.22)',
    accentGlow: 'rgba(16,185,129,0.4)',
    blue: '#60A5FA',
    blueDim: 'rgba(96,165,250,0.1)',
    blueGlow: 'rgba(96,165,250,0.3)',
    teal: '#2DD4BF',
    tealDim: 'rgba(45,212,191,0.1)',
    textPrimary: '#f1f5f9',
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
  },
  shadows: {
    card: '0 2px 8px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
    cardHover: '0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(16,185,129,0.2)',
    accent: '0 0 40px rgba(16,185,129,0.2)',
    accentStrong: '0 0 70px rgba(16,185,129,0.35)',
    glow: '0 0 100px rgba(16,185,129,0.1)',
    blue: '0 0 40px rgba(96,165,250,0.15)',
  },
};

export const theme = lightTheme;
