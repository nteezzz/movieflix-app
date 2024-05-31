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
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${item.id}?api_key=8e3b0e2988fbbca50323caff26dfd237`);
            return { ...item, runtime: response.data.runtime };
          } else {
            const response = await axios.get(`https://api.themoviedb.org/3/tv/${item.id}?api_key=8e3b0e2988fbbca50323caff26dfd237`);
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
      <Carousel plugins={[Autoplay({ delay: 3000 })]}>
        <CarouselContent className="bg-zinc-950">
          {items.map((item) => (
            <CarouselItem key={item.id}>
               <Link to={`/${item.type === 'movie' ? 'movies' : 'series'}/${item.id}`} className="text-red-600 hover:text-red-400">
               <Card className="flex flex-row bg-zinc-950 border-zinc-900 mx-auto relative overflow-hidden">
                <CardContent
                  className="bg-cover bg-right flex aspect-auto w-3/4 relative h-96 xl:h-[400px] 2xl:h-[500px]"
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${item.backdrop_path})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-50" />
                </CardContent>
                <div className="flex flex-col justify-center bg-black bg-opacity-50 p-4 rounded max-w-3xl text-left w-1/4 z-10 relative">
                  <h2 className="text-white font-semibold">
                    {item.type === 'movie' ? item.title : item.name}{" "}
                    {item.type === 'movie' ? 
                      `(${item.release_date.substring(0, 4)})` : 
                      `(${item.first_air_date.substring(0, 4)})`}
                  </h2>
                  
                  <div className="text-white mt-2">
                    <StarRating rating={item.vote_average} count={item.vote_count} />
                  </div>
                  <div className="text-white mt-2">
                    {item.type === 'movie' ? ` ${item.runtime} mins` : `${item.number_of_seasons} Seasons`}
                  </div>
                  <div className="text-white mt-2">
                    {item.type === 'movie' ? getMovieGenres(item.genre_ids).join(", ") : getTVGenres(item.genre_ids).join(", ")}
                  </div>
                  
                  <p className="text-white mt-2 hidden lg:block">
                    {truncateOverview(item.overview, 30)}
                    {item.overview.split(" ").length > 30 && (
                      <Link to={`/${item.type === 'movie' ? 'movies' : 'series'}/${item.id}`} className="text-red-600 hover:text-red-400">read more</Link>
                    )}
                  </p>
                </div>
              </Card>
               </Link>
              
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-zinc-900 border-zinc-900" />
        <CarouselNext className="bg-zinc-900 border-zinc-900" />
      </Carousel>
    </div>
  );
};
