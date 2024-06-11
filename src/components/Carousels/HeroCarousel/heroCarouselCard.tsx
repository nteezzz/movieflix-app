import React from 'react';
import StarRating from "@/components/StarRating/starRating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMovieGenres, getTVGenres, truncateOverview } from "@/lib/helper";
import useGenres from "@/lib/hooks/useGenres";
import { useWatchlist } from "@/lib/hooks/useWatchlist";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

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
  trailer: string | null;
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
  trailer: string | null;
}

interface HeroCarouselCardProps {
  item: Movie | Show;
  trailerMode: boolean; 
}

export const HeroCarouselCard: React.FC<HeroCarouselCardProps> = ({ item, trailerMode }) => {
  const { moviegenres, tvgenres } = useGenres();
  const handleAddToWatchList = useWatchlist();

  return (
    <Card className="flex flex-row bg-black border-zinc-900 mx-auto relative overflow-hidden rounded-md transform transition-transform hover:scale-105 hover:shadow-lg">
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
                ? getMovieGenres(moviegenres, item.genre_ids).join(", ")
                : getTVGenres(tvgenres, item.genre_ids).join(", ")}
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
            {trailerMode && item.trailer ? (
              <iframe
                src={item.trailer}
                allow="autoplay; encrypted-media"
                title="Trailer"
                className="rounded-md object-cover w-full h-full"
              ></iframe>
            ) : (
              <img
                className="object-cover w-full h-full"
                src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
              />
            )}
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
  );
};
