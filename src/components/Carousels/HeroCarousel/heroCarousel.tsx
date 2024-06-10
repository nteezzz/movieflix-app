import React, {useEffect, useState } from 'react';
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
import { API_KEY } from '@/config';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa';
import { Skeleton } from "@/components/ui/skeleton";
import { getMovieGenres, getTVGenres,truncateOverview } from '@/lib/helper';
import useGenres from '@/lib/hooks/useGenres';
import { useWatchlist } from '@/lib/hooks/useWatchlist';

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
  runtime?: number; 
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
  number_of_seasons?: number; 
  type: 'tv';
}


interface HeroCarouselProps {
  movieURL: string;
  tvURL: string;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ movieURL, tvURL }) => {
  const [items, setItems] = useState<(Movie | Show)[]>([]);
  const [loading, setLoading] = useState(true); 
  const handleAddToWatchList=useWatchlist();
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
        const shows = response.data.results.map((show: Show) => ({ ...show, type: 'tv' }));
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
      setLoading(false);
    };

    const fetchData = async () => {
      setLoading(true); 
      const movies = await fetchMovies();
      const shows = await fetchShows();
      const combined = [...movies, ...shows];
      await fetchDetails(combined);
    };

    fetchData();
  }, [movieURL, tvURL]);

  return (
    <div className="mt-5">
      <Carousel plugins={[Autoplay({ delay: 5000 })]}>
        <CarouselContent className="bg-zinc-950">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem key={index} className="group h-96 xl:h-[400px] 2xl:h-[500px]">
                <Card className="flex flex-row bg-black border-zinc-900 mx-auto relative overflow-hidden transform transition-transform hover:scale-105 hover:shadow-lg">
                  <CardContent className="flex flex-row">
                    <div className="flex flex-col justify-center bg-black bg-opacity-50 p-4 pl-10 rounded max-w-3xl text-left w-1/4 z-10 relative">
                      <Skeleton className="h-6 w-3/4 mb-4 animate-pulse" />
                      <Skeleton className="h-4 w-1/2 mb-2 animate-pulse" />
                      <Skeleton className="h-4 w-1/4 mb-2 animate-pulse" />
                      <Skeleton className="h-4 w-3/4 mb-2 animate-pulse" />
                      <Skeleton className="h-4 w-1/2 mb-2 animate-pulse" />
                    </div>
                    <div className="relative w-3/4 h-96 xl:h-[400px] 2xl:h-[500px]">
                      <Skeleton className="object-cover w-full h-full animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))
          ) : (
            items.map((item) => (
              <CarouselItem key={item.id} className="group h-96 xl:h-[400px] 2xl:h-[500px]">
                <Card className="flex flex-row bg-black border-zinc-900 mx-auto relative overflow-hidden transform transition-transform hover:scale-105 hover:shadow-lg">
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
                            ? getMovieGenres(moviegenres,item.genre_ids).join(", ")
                            : getTVGenres(tvgenres,item.genre_ids).join(", ")}
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
                    onClick={() => handleAddToWatchList({
                      id: item.id,
                      title: 'title' in item ? item.title : 'name' in item ? item.name : '',
                      type: item.type
                    })}
                    className="absolute h-[30px] bottom-2 right-2 transform bg-zinc-800 px-3 py-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <FaPlus className="mr-2" /> Add to Watchlist
                  </Button>
                </Card>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <CarouselPrevious className="bg-zinc-900 border-zinc-900" />
        <CarouselNext className="bg-zinc-900 border-zinc-900" />
      </Carousel>
    </div>
  );
};
