import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import { MovieHeader } from './components/MovieHeader/movieHeader';
import { HomePage } from './pages/Homepage/homePage';
import CategoryPage from './pages/Categorypage/categoryPage';
import MoviesShowsPage from './pages/MoviesShowsPage/moviesShowsPage';
import { DetailsPage } from './pages/DetailsPage/detailsPage';
import MyWatchlist from './pages/MyWishlist/myWishlist';

const App: React.FC = () => {
  return (
    <Router>
      <MovieHeader />
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/movies" element={<MoviesShowsPage category='movies'/>}/>
        <Route path="/series" element={<MoviesShowsPage category='shows'/>}/>   
        <Route path="/movies/:id" element={<DetailsPage/>}/>
        <Route path="/series/:id" element={<DetailsPage/>}/>
        <Route path="/popular" element={<CategoryPage category='popular'/>} />
        <Route path="/topRated" element={<CategoryPage category='topRated'/>} />
        <Route path="/nowPlaying" element={<CategoryPage category='nowPlaying'/>} />
        <Route path="/myWatchlist" element={<MyWatchlist/>} />
      </Routes>
    </Router>
  );
};

export default App;
