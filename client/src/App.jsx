import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from './routes/AppRouter'
import './App.css'
import MovieDetail from './pages/MovieDetail'
import MovieHero from './pages/test'

function App() {
  return (
    <div className="App">
      <Router>
        <AppRouter />
      </Router>
    </div>
  )
}

export default App
