import React, { useEffect, useState, useMemo } from 'react';
import { HeroCarousel } from '@/components/HeroCarousel/heroCarousel';
import { ListCarousel } from '@/components/ListCarousel/listCarousel';

interface CategoryPageProps {
  category: 'popular' | 'topRated' | 'nowPlaying';
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
  const [movieURL, setMovieURL] = useState<string>('');
  const [tvURL, setTvURL] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const apiKey = '8e3b0e2988fbbca50323caff26dfd237'; // Replace with your TMDb API key
  const baseURL = 'https://api.themoviedb.org/3';

  const urls = useMemo(() => {
    let MOVIE_URL, TV_URL;

    switch (category) {
      case 'popular':
        MOVIE_URL = `${baseURL}/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
        TV_URL = `${baseURL}/tv/popular?api_key=${apiKey}&language=en-US&page=1`;
        break;
      case 'topRated':
        MOVIE_URL = `${baseURL}/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
        TV_URL = `${baseURL}/tv/top_rated?api_key=${apiKey}&language=en-US&page=1`;
        break;
      case 'nowPlaying':
        MOVIE_URL = `${baseURL}/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`;
        TV_URL = `${baseURL}/tv/on_the_air?api_key=${apiKey}&language=en-US&page=1`;
        break;
      default:
        throw new Error('Invalid category');
    }

    return { MOVIE_URL, TV_URL };
  }, [category]);

  useEffect(() => {
    setMovieURL(urls.MOVIE_URL);
    setTvURL(urls.TV_URL);
    setLoading(false); // Assuming URLs are set immediately, otherwise adjust logic
  }, [urls]);

  return (
    <div className="flex flex-col mx-[48px] min-h-screen bg-zinc-950 text-white">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <HeroCarousel movieURL={movieURL} tvURL={tvURL} />
          <ListCarousel title={`${category} Movies`} URL={movieURL} />
          <ListCarousel title={`${category} TV shows`} URL={tvURL} />
        </>
      )}
    </div>
  );
};

export default CategoryPage;