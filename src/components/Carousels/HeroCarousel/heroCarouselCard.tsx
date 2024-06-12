import React from 'react';
import StarRating from "@/components/StarRating/starRating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMovieGenres, getTVGenres, truncateOverview } from "@/lib/helper";
import useGenres from "@/lib/hooks/useGenres";
import { useWatchlist } from "@/lib/hooks/useWatchlist";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import '../carousel.css'; // Ensure you create this CSS file and import it

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
    <div className="group card-container">
      <Card className="relative mx-auto overflow-hidden rounded-md bg-black border-zinc-900 card-hover">
        <Link to={`/${item.type === 'movie' ? 'movies' : 'series'}/${item.id}`} className="w-full flex flex-col md:flex-row text-red-600 hover:text-red-400">
          <CardContent className="relative z-10 flex flex-col justify-center w-full p-4 pl-10 text-left bg-black bg-opacity-50 rounded md:w-1/3 max-w-3xl">
            <h2 className="mb-2 text-lg font-semibold text-white md:text-xl">
              {item.type === 'movie' ? item.title : item.name}{" "}
              {item.type === 'movie'
                ? `(${item.release_date.substring(0, 4)})`
                : `(${item.first_air_date.substring(0, 4)})`}
            </h2>
            <div className="mt-4 text-white">
              <StarRating rating={item.vote_average} count={item.vote_count} />
            </div>
            <div className="mt-2 text-white">
              {item.type === 'movie' ? `${item.runtime} mins` : `${item.number_of_seasons} Seasons`}
            </div>
            <div className="mt-2 text-white">
              {item.type === 'movie'
                ? getMovieGenres(moviegenres, item.genre_ids).join(", ")
                : getTVGenres(tvgenres, item.genre_ids).join(", ")}
            </div>
            <p className="hidden mt-2 text-white lg:block">
              {truncateOverview(item.overview, 25)}
              {item.overview.split(" ").length > 25 && (
                <Link to={`/${item.type === 'movie' ? 'movies' : 'series'}/${item.id}`} className="text-red-600 hover:text-red-400">read more</Link>
              )}
            </p>
          </CardContent>
          <div className="relative w-full h-60 md:w-2/3 md:h-96 xl:h-[400px] 2xl:h-[500px]">
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-black to-transparent" />
            {trailerMode && item.trailer ? (
              <iframe
                src={item.trailer}
                allow="autoplay; fullscreen; encrypted-media"
                allowFullScreen
                title="Trailer"
                className="object-cover w-full h-full rounded-md"
              ></iframe>
            ) : (
              <img
                className="object-cover w-full h-full"
                src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                alt={item.type === 'movie' ? item.title : item.name}
              />
            )}
          </div>
        </Link>
        <Button
          onClick={(event) => {
            event.stopPropagation();
            handleAddToWatchList({
              id: item.id,
              title: 'title' in item ? item.title : 'name' in item ? item.name : '',
              type: item.type
            });
          }}
          className="absolute bottom-4 right-4 px-4 py-2 text-white bg-zinc-800 z-20"
        >
          <FaPlus className="mr-2" /> Add to Watchlist
        </Button>
      </Card>
    </div>
  );
};
