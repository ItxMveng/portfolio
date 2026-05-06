import type { AppProps } from 'next/app';
import { MemoryRouter } from 'react-router-dom';
import { AppThemeProvider } from '../contexts/ThemeContext';
import { ChatAssistant } from '../components/assistant/ChatAssistant';
import { GlobalStyles } from '../styles/GlobalStyles';

export default function CompatApp({ Component, pageProps, router }: AppProps) {
  const PageComponent = Component as typeof Component & {
    disableCompatRouter?: boolean;
  };

  return (
    <AppThemeProvider>
      <GlobalStyles />
      {PageComponent.disableCompatRouter ? (
        <PageComponent {...pageProps} />
      ) : (
        <MemoryRouter key={router.asPath} initialEntries={[router.asPath]}>
          <PageComponent {...pageProps} />
        </MemoryRouter>
      )}
      <ChatAssistant />
    </AppThemeProvider>
  );
}
