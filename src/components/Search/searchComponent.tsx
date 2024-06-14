import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import { Input } from "../ui/input";
import { API_KEY } from "@/config";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import "../Carousels/carousel.css";
import { useWatchlist } from "@/lib/hooks/useWatchlist";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/app/store";
import { fetchActivity } from "@/redux/slice/activitySlice";
import { Genre } from "@/redux/slice/activitySlice";

interface Media {
  id: number;
  original_name?: string;
  original_title?: string;
  poster_path: string;
  media_type: 'movie' | 'tv';
}

export const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Media[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Media[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [displayQuery, setDisplayQuery] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [topMovies, setTopMovies] = useState<Media[]>([]);
  const [topSeries, setTopSeries] = useState<Media[]>([]);
  const dispatch = useDispatch<AppDispatch>(); 
  const handleAddToWatchlist = useWatchlist();
  const uid = useSelector((state: RootState) => state.auth.uid);
  const movieGenre = useSelector((state: RootState) => state.activity.movieGenre);
  const tvGenre = useSelector((state: RootState) => state.activity.tvGenre);

  useEffect(() => {
    if (uid) {
      dispatch(fetchActivity(uid));
    }
  }, [uid, dispatch]);

  useEffect(() => {
    const fetchMoviesBasedOnGenres = async (genres: Genre[], type: 'movie' | 'tv') => {
      try {
        const genrePromises = genres.map(genre =>
          axios.get(`https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&with_genres=${genre.id}`)
        );
        const genreResults = await Promise.all(genrePromises);
        //const media = genreResults.flatMap(response => response.data.results);
        const uniqueMediaIds = new Set<number>();

    // Flatten and filter duplicates
    const media = genreResults.flatMap(response => response.data.results)
                             .filter(item => {
                               if (!uniqueMediaIds.has(item.id)) {
                                 uniqueMediaIds.add(item.id);
                                 return true;
                               }
                               return false;
                             });

        if (type === 'movie') {
          setTopMovies(media);
        } else {
          setTopSeries(media);
        }
      } catch (error) {
        console.error(`Error fetching ${type}s based on genres:`, error);
      }
    };

    if (movieGenre.length > 0) {
      const topMovieGenres = movieGenre.slice(0, 3);
      fetchMoviesBasedOnGenres(topMovieGenres, 'movie');
    }

    if (tvGenre.length > 0) {
      const topTVGenres = tvGenre.slice(0, 3);
      fetchMoviesBasedOnGenres(topTVGenres, 'tv');
    }
  }, [movieGenre, tvGenre]);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
        setTrendingMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      }
    };

    fetchTrendingMovies();
  }, []);

  const handleSearch = async () => {
    setDisplayQuery(query);
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`);
      setResults(response.data.results);
    } catch (error) {
      console.error('Error searching movies:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderMovies = (movies: Media[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((item) => (
        <div key={item.id} className="relative p-1 group card-container">
          <Link to={`/${item.media_type === 'movie' ? 'movies' : 'series'}/${item.id}`} onClick={() => setDialogOpen(false)}>
            <Card className="bg-zinc-950 border-zinc-900 card-hover transition-transform transform hover:scale-105">
              <CardContent className="flex aspect-auto items-center justify-center">
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.original_name || item.original_title}
                  className="object-cover h-full w-full rounded-md"
                />
              </CardContent>
            </Card>
          </Link>
          <Button
            onClick={() => handleAddToWatchlist({
              id: item.id,
              title: item.media_type === 'movie' ? (item.original_title || '') : (item.original_name || ''),
              type: item.media_type
            })}
            className="absolute h-[30px] bottom-2 right-2 bg-zinc-800 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <FaPlus />
          </Button>
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={dialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setDialogOpen(true)} className="bg-zinc-950 hover:bg-zinc-900 transition-colors">
          <FaSearch />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-custom-red w-[80%] max-w-6xl h-[90vh] mx-auto overflow-y-auto p-4 custom-scrollbar">
        <DialogHeader>
          <div className="flex flex-row w-full">
            <Input
              type="text"
              placeholder="Search movies, tv shows..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow ml-2 bg-zinc-700 text-white"
            />
            <Button onClick={handleSearch} className="ml-2 bg-zinc-950 hover:bg-zinc-900 transition-colors">
              <FaSearch />
            </Button>
            <Button onClick={() => setDialogOpen(false)} className="ml-2 bg-zinc-950 hover:bg-zinc-900 transition-colors">
              <FaTimes />
            </Button>
          </div>
        </DialogHeader>
        <div className="mt-4">
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array(10).fill(0).map((_, index) => (
                <div key={index} className="bg-zinc-950 border-zinc-900 p-2">
                  <Skeleton className="bg-zinc-900 h-[231px] rounded-md" height={300} />
                </div>
              ))}
            </div>
          )}

          {!loading && results.length === 0 && query.trim() === '' && (
            <>
              
              {uid ? (
                <>
                  {topMovies.length > 0 && (
                    <>
                      <p className="text-white text-lg">Movies Curated for you</p>
                      {renderMovies(topMovies)}
                    </>
                  )}
                  {topSeries.length > 0 && (
                    <>
                      <p className="text-white text-lg mt-4">Series Curated for you</p>
                      {renderMovies(topSeries)}
                    </>
                  )}
                </>
              ) : (
                <>
                <p className="text-white text-lg">Trending Now</p>
                {renderMovies(trendingMovies)}
                </>
              )}
            </>
          )}

          {!loading && results.length > 0 && (
            <>
              <p className="text-white text-lg">Search Results for {displayQuery}</p>
              {renderMovies(results)}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
