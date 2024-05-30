import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import {
Carousel,
CarouselContent,
CarouselItem,
CarouselNext,
CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import StarRating from "../StarRating/starRating";
import { Link } from "react-router-dom";
import useGenres from '../Genres/useGenres';

// Define the Movie interface
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
interface Show{
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

// Define the props for HeroCarousel
interface HeroCarouselProps {
movieURL: string;
tvURL: string;
} 

export const HeroCarousel: React.FC<HeroCarouselProps> = ({movieURL, tvURL}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const { genres, loading, error } = useGenres('movie');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(movieURL);
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    const fetchShows = async () => {
      try {
        const response = await axios.get(tvURL);
        setShows(response.data.results);
      } catch (error) {
        console.error('Error fetching shows:', error);
      }
    };
    fetchMovies();
    fetchShows();
  }, []);

  const getGenreNames = (genreIds: number[]): string[] => {
  return genreIds.map((id) => {
  const genre = genres.find((genre) => genre.id === id);
  return genre ? genre.name : "";
  });
  };
  const truncateOverview = (overview: string, maxWords: number): string => {
  const words = overview.split(" ");
  if (words.length > maxWords) {
  return words.slice(0, maxWords).join(" ") + "...";
  } else {
  return overview;
  }
  };
  return (
  <div className="mt-[5px]">
    <Carousel plugins={[ Autoplay({ delay: 3000, }), ]}>
      <CarouselContent className="bg-zinc-950">
        {movies.map((movie) => (
        <CarouselItem key={movie.id}>
          <Card className="flex flex-row bg-zinc-950 border-zinc-900  mx-auto relative overflow-hidden">
            <CardContent className="bg-cover bg-right flex aspect-auto h-[400px] w-3/4 relative" style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}>
              <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-50" />
            </CardContent>
            <div
              className="flex flex-col justify-center bg-black bg-opacity-50 p-4 rounded max-w-3xl text-left w-1/4 z-10 relative">
              <h2 className="text-white font-semibold">
                {movie.title}{"("}{movie.release_date.substring(0, 4)}{")"}
              </h2>
              <div className="text-white mt-2">
                <StarRating rating={movie.vote_average} count={movie.vote_count} />
              </div>
              <div className="text-white mt-2">
                {getGenreNames(movie.genre_ids).join(", ")}
              </div>
              <p className="text-white mt-2">
                {truncateOverview(movie.overview, 30)}
                {movie.overview.split(" ").length > 30 && (
                 <Link to={`/movies/${movie.id}`} className="text-red-600 hover:text-red-400">read more</Link>
                
                )}
              </p>
            </div>
          </Card>
        </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-zinc-900 border-zinc-900" />
      <CarouselNext className="bg-zinc-900 border-zinc-900" />
    </Carousel>
  </div>
  );
  };