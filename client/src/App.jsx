import { useState } from 'react'
import AppRouter from './routes/AppRouter'
import './App.css'
import MovieDetail from './pages/MovieDetail'
import MovieHero from './pages/test'

function App() {
  return (
    <div className="App">
      <AppRouter />
      {/* <MovieDetail/> */}
    </div>
  )
}

export default App
