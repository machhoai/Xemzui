import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from './routes/AppRouter';
import { LoadingProvider } from './contexts/LoadingContext';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <LoadingProvider>
          <AppRouter />
        </LoadingProvider>
      </Router>
    </div>
  );
}

export default App;
