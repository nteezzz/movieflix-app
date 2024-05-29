import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import { MovieHeader } from './components/MovieHeader/movieHeader';
import { HomePage } from './pages/Homepage/homePage';

const App: React.FC = () => {
  return (
    <Router>
      <MovieHeader />
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/movies" />
        <Route path="/series" />   
        <Route path="/movies/:id" />
      </Routes>
    </Router>
  );
};

export default App;
