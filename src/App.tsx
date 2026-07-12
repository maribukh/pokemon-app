import { Component } from 'react';
import HomePage from './pages/HomePage';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './App.css';

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <div className="app-shell">
          <HomePage />
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
