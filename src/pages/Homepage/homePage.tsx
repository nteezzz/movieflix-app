// src/pages/HomePage/homePage.tsx
import React from 'react';
import { HeroCarousel } from '@/components/HeroCarousel/heroCarousel';
import { ListCarousel } from '@/components/ListCarousel/listCarousel'

const API_KEY = '8e3b0e2988fbbca50323caff26dfd237';
const MOVIE_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
const TV_URL = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`;
const TREND_MOVIES=`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;
const TREND_TV=`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`;

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col mx-[48px] min-h-screen bg-zinc-950 text-white">
      <HeroCarousel movieURL={MOVIE_URL} tvURL={TV_URL}/>
      <ListCarousel title="Trending Movies" URL={TREND_MOVIES}/>
      <ListCarousel title="Trending TV shows" URL={TREND_TV} />      
    </div>
  );
};

