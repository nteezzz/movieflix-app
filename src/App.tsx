import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import { MovieHeader } from './components/MovieHeader/movieHeader';
import { HomePage } from './pages/Homepage/homePage';
import CategoryPage from './pages/Categorypage/categoryPage';

const App: React.FC = () => {
  return (
    <Router>
      <MovieHeader />
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/movies" />
        <Route path="/series" />   
        <Route path="/popular" element={<CategoryPage category='popular'/>} />
        <Route path="/topRated" element={<CategoryPage category='topRated'/>} />
        <Route path="/nowPlaying" element={<CategoryPage category='nowPlaying'/>} />

      </Routes>
    </Router>
  );
};

export default App;
