import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PokemonDetails from './pages/PokemonDetails/PokemonDetails';
import About from './pages/About/About';
import NotFound from './pages/NotFound/NotFound';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Flyout from './components/Flyout/Flyout';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <div className="app-shell">
            <Routes>
              <Route path="/" element={<HomePage />}>
                <Route path="details/:id" element={<PokemonDetails />} />
              </Route>
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Flyout />
          </div>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
