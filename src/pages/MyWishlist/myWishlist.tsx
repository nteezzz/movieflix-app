import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/app/store';
import { fetchWatchlist, removeItemFromFirestore } from '@/redux/slice/watchlistSlice';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import StarRating from "../../components/StarRating/starRating";
import { Link } from "react-router-dom";
import axios from 'axios';
import { API_KEY } from '@/config';


interface WatchlistItem {
  id: number;
  title: string;
  type: 'movie' | 'show';
}
interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  genres: Genre[];
  runtime: number;
  release_date: string;
}

interface Show {
  id: number;
  name: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  genres: Genre[];
  number_of_seasons: number;
  first_air_date: string;
}

type Item = Movie | Show;

const MyWatchlist: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const uid = useSelector((state: RootState) => state.auth.uid);
  const watchlist = useSelector((state: RootState) => state.watchlist.watchlist);
  const [details, setDetails] = useState<Item[]>([]);

  useEffect(() => {
    if (uid) {
      dispatch(fetchWatchlist(uid));
    }
  }, [dispatch, uid]);

  useEffect(() => {
    const fetchDetails = async () => {
      const detailedItems = await Promise.all(
        watchlist.map(async (item) => {
          if (item.type === 'movie') {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${item.id}?api_key=${API_KEY}`);
            return response.data as Movie;
          } else {
            const response = await axios.get(`https://api.themoviedb.org/3/tv/${item.id}?api_key=${API_KEY}`);
            return response.data as Show;
          }
        })
      );
      setDetails(detailedItems);
    };

    if (watchlist.length > 0) {
      fetchDetails();
    }
  }, [watchlist]);

  const handleDelete = (item: WatchlistItem) => {
    if (uid) {
      dispatch(removeItemFromFirestore({ userId: uid, itemId: item.id }));
    }
  };

  const getGenreNames = (genres: Genre[]): string[] => {
    return genres.map((genre) => genre.name);
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
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {details.map((item) => (
        <Card key={item.id} className="flex flex-col bg-black border-zinc-900 relative overflow-hidden transition-transform duration-300 transform hover:scale-105">
          <Link to={`/${'title' in item ? 'movies' : 'series'}/${item.id}`} className="text-red-600 hover:text-red-400">
            <CardContent className="flex flex-col p-4 absolute inset-0 bg-black bg-opacity-60 opacity-0 transition-opacity duration-300 hover:opacity-100">
              <h2 className="text-white text-left font-semibold">
                {'title' in item ? item.title : item.name}{" "}
                {'title' in item
                  ? `(${new Date(item.release_date).getFullYear()})`
                  : `(${new Date(item.first_air_date).getFullYear()})`}
              </h2>
              <div className="text-white mt-2">
                <StarRating rating={item.vote_average} count={item.vote_count} />
              </div>
              <div className="text-white mt-2">
                {'runtime' in item ? `${item.runtime} mins` : `${item.number_of_seasons} Seasons`}
              </div>
              <div className="text-white mt-2">
                {getGenreNames(item.genres).join(", ")}
              </div>
              <p className="text-white mt-2">
                {truncateOverview(item.overview, 25)}
              </p>
              <Button
                onClick={() => handleDelete({ id: item.id, title: 'title' in item ? item.title : item.name, type: 'title' in item ? 'movie' : 'show' })}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
              >
                Delete
              </Button>
            </CardContent>
            <div className="relative">
              <img
                className="object-cover h-full w-full rounded-md"
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={'title' in item ? item.title : item.name}
              />
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default MyWatchlist;
