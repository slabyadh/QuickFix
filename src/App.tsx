import { AuthProvider } from "./contexts/auth";
import { ThemeProvider } from "./contexts/theme";
import Router from './Router';
import './App.css';

function App() {
  return (
    <>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="quickfix-theme">
          <Router />
        </ThemeProvider>
      </AuthProvider>
    </>
  );
}

export default App;