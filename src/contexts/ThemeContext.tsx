import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from '../styles/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggle: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: 'light',
  toggle: () => {},
});

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      return (localStorage.getItem('theme') as ThemeMode) ?? 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    localStorage.setItem('theme', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggle = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));
  const currentTheme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
