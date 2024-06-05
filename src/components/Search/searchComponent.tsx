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
import { FaBackward, FaPlus, FaSearch } from "react-icons/fa";
import { Input } from "../ui/input";
import { API_KEY } from "@/config";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [displayQuery, setDisplayQuery] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

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
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
      setResults(response.data.results);
    } catch (error) {
      console.error('Error searching movies:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Dialog open={dialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={()=>setDialogOpen(true)} className="bg-zinc-950">
          <FaSearch />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 w-[80%] max-w-6xl h-[90vh] mx-auto overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-row w-full">
            <Button className="bg-zinc-950" onClick={()=>setDialogOpen(false)}><FaBackward/></Button>
            <Input
              type="text"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                
              }}
              className="flex-grow"
            />
            <Button onClick={handleSearch} className="ml-2"><FaSearch /></Button>
          </div>
        </DialogHeader>
        <div>
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array(10).fill(0).map((_, index) => (
                <div key={index} className="bg-zinc-950 border-zinc-900 p-2">
                  <Skeleton className="bg-zinc-900 h-[231px]" height={300} />
                </div>
              ))}
            </div>
          )}

          {!loading && results.length === 0 && query.trim() === '' && (
            <>
              <p className="text-white text-lg">Trending Now</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {trendingMovies.map((item) => (
                  <div className="relative p-1 group">
                    <Link to={`/movies/${item.id}`} key={item.id} onClick={()=>setDialogOpen(false)}>
                    <Card className="bg-zinc-950 border-zinc-900">
                      <CardContent className="flex aspect-auto items-center justify-center p-2">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                          alt={item.title}
                          className="object-cover h-full w-full"
                        />
                      </CardContent>
                    </Card>
                  </Link>
                  <Button
                  // onClick={() => handleAddToWatchlist(item)}
                  className="absolute h-[30px] bottom-2 right-2 transform bg-zinc-800 px-[8px] py-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <FaPlus />
                  </Button>

                  </div>
                  
                  
                ))}
              </div>
            </>
          )}

          {!loading && results.length > 0 && (
            <>
              <p className="text-white text-lg">Search Results for {displayQuery}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {results.map((item) => (
                  <div className="relative p-1 group">
                    <Link to={`/movies/${item.id}`} key={item.id} onClick={()=>setDialogOpen(false)}>
                    <Card className="bg-zinc-950 border-zinc-900">
                      <CardContent className="flex aspect-auto items-center justify-center p-2">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                          alt={item.title}
                          className="object-cover h-full w-full"
                        />
                      </CardContent>
                    </Card>
                  </Link>
                  <Button
                  // onClick={() => handleAddToWatchlist(item)}
                  className="absolute h-[30px] bottom-2 right-2 transform bg-zinc-800 px-[8px] py-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <FaPlus />
                  </Button>
                  </div>
                  
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
