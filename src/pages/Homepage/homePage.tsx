// src/pages/HomePage/homePage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HeroCarousel } from '@/components/HeroCarousel/heroCarousel';
import { ListCarousel } from '@/components/ListCarousel/listCarousel'

const API_KEY = '8e3b0e2988fbbca50323caff26dfd237';
const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
const GENRE_API=`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
const TREND_MOVIES=`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;
const TREND_TV=`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`;

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
}
interface Genre {
  id: number;
  name: string;
}

export const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(API_URL);
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    const fetchGenres =async ()=>{
      try {
        const response = await axios.get(GENRE_API);
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    }

    fetchMovies();
    fetchGenres();
  }, []);

  return (
    <div className="flex flex-col mx-[48px] min-h-screen bg-zinc-950 text-white">
      <HeroCarousel movies={movies} genres={genres}/>
      <ListCarousel title="Trending Movies" URL={TREND_MOVIES}/>
      <ListCarousel title="Trending TV shows" URL={TREND_TV} />      
    </div>
  );
};

