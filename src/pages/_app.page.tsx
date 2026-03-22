import type { AppProps } from 'next/app';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ChatAssistant } from '../components/assistant/ChatAssistant';
import { GlobalStyles } from '../styles/GlobalStyles';
import { theme } from '../styles/theme';

export default function CompatApp({ Component, pageProps, router }: AppProps) {
  const PageComponent = Component as typeof Component & {
    disableCompatRouter?: boolean;
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {PageComponent.disableCompatRouter ? (
        <PageComponent {...pageProps} />
      ) : (
        <MemoryRouter key={router.asPath} initialEntries={[router.asPath]}>
          <PageComponent {...pageProps} />
        </MemoryRouter>
      )}
      <ChatAssistant />
    </ThemeProvider>
  );
}
