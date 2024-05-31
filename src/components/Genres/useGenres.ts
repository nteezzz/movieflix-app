import { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = '8e3b0e2988fbbca50323caff26dfd237';
const BASE_URL = 'https://api.themoviedb.org/3';

interface Genre {
  id: number;
  name: string;
}

interface UseGenresReturn {
  tvgenres: Genre[];
  moviegenres: Genre[];
  loading: boolean;
  error: string | null;
}

const useGenres = (): UseGenresReturn => {
  const [tvgenres, setTvGenres] = useState<Genre[]>([]);
  const [moviegenres, setMovieGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      setError(null);

      try {
        const movieresponse = await axios.get(`${BASE_URL}/genre/movie/list`, {
          params: { api_key: API_KEY, language: 'en-US' },
        });
        const tvresponse = await axios.get(`${BASE_URL}/genre/tv/list`, {
          params: { api_key: API_KEY, language: 'en-US' },
        });
          setMovieGenres(movieresponse.data.genres);
          setTvGenres(tvresponse.data.genres);

      } catch (err: any) {
        setError(err.message);
      }

      setLoading(false);
    };

    fetchGenres();
  }, []);

  return {
    tvgenres,
    moviegenres,
    loading,
    error,
  };
};

export default useGenres;
