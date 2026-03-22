import { ThemeProvider } from 'styled-components';
import { ChatAssistant } from './components/assistant/ChatAssistant';
import { AppRouter } from './router';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppRouter />
      <ChatAssistant />
    </ThemeProvider>
  );
}

export default App;
