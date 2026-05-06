import { ChatAssistant } from './components/assistant/ChatAssistant';
import { AppThemeProvider } from './contexts/ThemeContext';
import { AppRouter } from './router';
import { GlobalStyles } from './styles/GlobalStyles';

function App() {
  return (
    <AppThemeProvider>
      <GlobalStyles />
      <AppRouter />
      <ChatAssistant />
    </AppThemeProvider>
  );
}

export default App;
