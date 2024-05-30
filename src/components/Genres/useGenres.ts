import { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = '8e3b0e2988fbbca50323caff26dfd237';
const BASE_URL = 'https://api.themoviedb.org/3';

interface Genre {
  id: number;
  name: string;
}

interface UseGenresReturn {
  genres: Genre[];
  loading: boolean;
  error: string | null;
}

const useGenres = (type: 'movie' | 'tv'): UseGenresReturn => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${BASE_URL}/genre/${type}/list`, {
          params: { api_key: API_KEY, language: 'en-US' },
        });
        setGenres(response.data.genres);
      } catch (err: any) {
        setError(err.message);
      }

      setLoading(false);
    };

    fetchGenres();
  }, [type]);

  return { genres, loading, error };
};

export default useGenres;
