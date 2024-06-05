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
import StarRating from "../../StarRating/starRating";
import { Link } from "react-router-dom";
import useGenres from '../../Genres/useGenres';
import { API_KEY } from '@/config';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa';

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
  runtime?: number; // Optional property for runtime
  type: 'movie';
}

interface Show {
  id: number;
  name: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  first_air_date: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  number_of_seasons?: number; // Optional property for number of seasons
  type: 'show';
}

interface HeroCarouselProps {
  movieURL: string;
  tvURL: string;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ movieURL, tvURL }) => {
  const [items, setItems] = useState<(Movie | Show)[]>([]);
  const { moviegenres, tvgenres } = useGenres();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(movieURL);
        const movies = response.data.results.map((movie: Movie) => ({ ...movie, type: 'movie' }));
        return movies;
      } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
      }
    };

    const fetchShows = async () => {
      try {
        const response = await axios.get(tvURL);
        const shows = response.data.results.map((show: Show) => ({ ...show, type: 'show' }));
        return shows;
      } catch (error) {
        console.error('Error fetching shows:', error);
        return [];
      }
    };

    const fetchDetails = async (items: (Movie | Show)[]) => {
      const detailedItems = await Promise.all(
        items.map(async (item) => {
          if (item.type === 'movie') {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${item.id}?api_key=${API_KEY}`);
            return { ...item, runtime: response.data.runtime };
          } else {
            const response = await axios.get(`https://api.themoviedb.org/3/tv/${item.id}?api_key=${API_KEY}`);
            return { ...item, number_of_seasons: response.data.number_of_seasons };
          }
        })
      );
      setItems(detailedItems);
    };

    const fetchData = async () => {
      const movies = await fetchMovies();
      const shows = await fetchShows();
      const combined = [...movies, ...shows];
      await fetchDetails(combined);
    };

    fetchData();
  }, [movieURL, tvURL]);

  const getMovieGenres = (genreIds: number[]): string[] => {
    return genreIds.map((id) => {
      const genre = moviegenres.find((genre) => genre.id === id);
      return genre ? genre.name : "";
    });
  };

  const getTVGenres = (genreIds: number[]): string[] => {
    return genreIds.map((id) => {
      const genre = tvgenres.find((genre) => genre.id === id);
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
      <Carousel plugins={[Autoplay({ delay: 5000 })]}>
        <CarouselContent className="bg-zinc-950">
          {items.map((item) => (
            <CarouselItem key={item.id} className="group">
              
                <Card className="flex flex-row bg-black border-zinc-900 mx-auto relative overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg">
                <Link to={`/${item.type === 'movie' ? 'movies' : 'series'}/${item.id}`} className="text-red-600 hover:text-red-400">
                  <CardContent className="flex flex-row">
                    <div className="flex flex-col justify-center bg-black bg-opacity-50 p-4 pl-10 rounded max-w-3xl text-left w-1/4 z-10 relative">
                      <h2 className="text-white font-semibold">
                        {item.type === 'movie' ? item.title : item.name}{" "}
                        {item.type === 'movie'
                          ? `(${item.release_date.substring(0, 4)})`
                          : `(${item.first_air_date.substring(0, 4)})`}
                      </h2>

                      <div className="text-white mt-4">
                        <StarRating rating={item.vote_average} count={item.vote_count} />
                      </div>
                      <div className="text-white mt-2">
                        {item.type === 'movie' ? `${item.runtime} mins` : `${item.number_of_seasons} Seasons`}
                      </div>
                      <div className="text-white mt-2">
                        {item.type === 'movie'
                          ? getMovieGenres(item.genre_ids).join(", ")
                          : getTVGenres(item.genre_ids).join(", ")}
                      </div>

                      <p className="text-white mt-2 hidden lg:block">
                        {truncateOverview(item.overview, 25)}
                        {item.overview.split(" ").length > 25 && (
                          <Link to={`/${item.type === 'movie' ? 'movies' : 'series'}/${item.id}`} className="text-red-600 hover:text-red-400">read more</Link>
                        )}
                      </p>

                    </div>
                    <div className="relative w-3/4 h-96 xl:h-[400px] 2xl:h-[500px]">
                      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />
                      <img
                        className="object-cover w-full h-full"
                        src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                      />
                    </div>

                  </CardContent>
                  </Link>
                  <Button
                    // onClick={() => handleAddToWatchlist(item)}
                    className="absolute h-[30px] bottom-2 right-2 transform bg-zinc-800 px-[8px] py-[8px] pr-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <FaPlus className="mr-2" /> Add to Watchlist
                  </Button>
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
