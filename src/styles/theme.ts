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
    // Accent navy (actions) — cf. bandeau du CV
    accent: string;
    accentHover: string;
    accentDim: string;
    accentDimHover: string;
    accentGlow: string;
    // Secondaires : gold = or du CV (highlights), navyDeep = aplats sombres
    gold: string;
    goldSoft: string;
    goldDim: string;
    goldGlow: string;
    navyDeep: string;
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
    sans: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "'Poppins', 'Montserrat', -apple-system, sans-serif",
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

/* Thème unique repris du CV : navy #323B4C, or #C9A204, gris #4D4D4F sur blanc. */
export const theme: Theme = {
  ...shared,
  colors: {
    bg: '#FFFFFF',
    bgSecondary: '#F5F7FA',
    bgTertiary: '#ECEFF5',
    bgCard: '#FFFFFF',
    bgCardHover: '#FAFBFD',
    surface: 'rgba(50,59,76,0.04)',
    surfaceHover: 'rgba(50,59,76,0.08)',
    surfaceBorder: 'rgba(50,59,76,0.14)',
    surfaceBorderHover: 'rgba(201,162,4,0.55)',
    // Accent : navy du CV — le texte blanc reste lisible dessus
    accent: '#323B4C',
    accentHover: '#232C3C',
    // Dims dorés : pastille or + texte navy, comme les tags du CV
    accentDim: 'rgba(201,162,4,0.14)',
    accentDimHover: 'rgba(201,162,4,0.24)',
    accentGlow: 'rgba(201,162,4,0.35)',
    gold: '#C9A204',
    goldSoft: '#E8C34A',
    goldDim: 'rgba(201,162,4,0.14)',
    goldGlow: 'rgba(201,162,4,0.4)',
    navyDeep: '#1E2635',
    onAccent: '#1E2635',
    textPrimary: '#1E2635',
    textSecondary: '#4D4D4F',
    textMuted: '#646C7B',
    textAccent: '#8A6E02',
    success: '#1E8E5A',
    warning: '#B7791F',
    danger: '#C0392B',
    info: '#323B4C',
    calloutInfo: 'rgba(50,59,76,0.06)',
    calloutWarning: 'rgba(201,162,4,0.12)',
    calloutDanger: 'rgba(192,57,43,0.07)',
    calloutTip: 'rgba(201,162,4,0.1)',
    divider: 'rgba(50,59,76,0.1)',
  },
  gradients: {
    brand: 'linear-gradient(135deg, #3C4860 0%, #2A3345 60%, #1E2635 100%)',
    gold: 'linear-gradient(135deg, #E8C34A 0%, #C9A204 55%, #A8850A 100%)',
    navy: 'linear-gradient(160deg, #323B4C 0%, #1E2635 100%)',
    soft: 'linear-gradient(135deg, rgba(201,162,4,0.14) 0%, rgba(50,59,76,0.08) 100%)',
  },
  shadows: {
    sm: '0 1px 2px rgba(30,38,53,0.06)',
    md: '0 4px 10px rgba(30,38,53,0.08), 0 2px 4px rgba(30,38,53,0.05)',
    lg: '0 12px 30px rgba(30,38,53,0.12), 0 4px 10px rgba(30,38,53,0.06)',
    card: '0 1px 3px rgba(30,38,53,0.07), 0 6px 18px rgba(30,38,53,0.05)',
    cardHover: '0 14px 38px rgba(30,38,53,0.16), 0 3px 10px rgba(201,162,4,0.12)',
    cardRaised: '0 24px 60px rgba(30,38,53,0.2), 0 8px 22px rgba(30,38,53,0.08)',
    accent: '0 6px 22px rgba(50,59,76,0.28)',
    accentStrong: '0 10px 38px rgba(50,59,76,0.4)',
    glow: '0 0 70px rgba(201,162,4,0.22)',
    blue: '0 4px 20px rgba(201,162,4,0.25)',
  },
};
