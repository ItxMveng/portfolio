import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from '../styles/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggle: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: 'dark',
  toggle: () => {},
});

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

function applyThemeToDom(mode: ThemeMode) {
  const root = document.documentElement;
  root.setAttribute('data-theme', mode);
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'dark';
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light') return 'light';
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    localStorage.setItem('theme', mode);
    applyThemeToDom(mode);
  }, [mode]);

  // Synchroniser au montage (hydratation SSR)
  useEffect(() => {
    applyThemeToDom(mode);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));
  const currentTheme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
