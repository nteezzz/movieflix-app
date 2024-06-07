import React, { useEffect, useState, useMemo } from 'react';
import { HeroCarousel } from '@/components/Carousels/HeroCarousel/heroCarousel';
import { ListCarousel } from '@/components/Carousels/ListCarousel/listCarousel';
import { API_KEY } from '@/config';

interface CategoryPageProps {
  category: 'popular' | 'topRated' | 'nowPlaying';
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
  const [movieURL, setMovieURL] = useState<string>('');
  const [tvURL, setTvURL] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [carouselKey, setCarouselKey] = useState<number>(0); 
  const baseURL = 'https://api.themoviedb.org/3';

  const urls = useMemo(() => {
    let MOVIE_URL, TV_URL, title;

    switch (category) {
      case 'popular':
        MOVIE_URL = `${baseURL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        TV_URL = `${baseURL}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`;
        title = 'Popular ';
        break;
      case 'topRated':
        MOVIE_URL = `${baseURL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
        TV_URL = `${baseURL}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`;
        title = 'Top Rated ';
        break;
      case 'nowPlaying':
        MOVIE_URL = `${baseURL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`;
        TV_URL = `${baseURL}/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=1`;
        title = `Now Playing`;
        break;
      default:
        throw new Error('Invalid category');
    }

    return { MOVIE_URL, TV_URL, title };
  }, [category]);

  useEffect(() => {
    setMovieURL(urls.MOVIE_URL);
    setTvURL(urls.TV_URL);
    setLoading(false);
    setCarouselKey((prevKey) => prevKey + 1);
  }, [urls, category]);

  return (
    <div className="flex flex-col mx-[48px] min-h-screen bg-zinc-950 text-white">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <HeroCarousel movieURL={movieURL} tvURL={tvURL} />
          <ListCarousel key={`movie-${carouselKey}`} title={`${urls.title} Movies`} URL={movieURL} />
          <ListCarousel key={`tv-${carouselKey}`} title={`${urls.title} TV shows`} URL={tvURL} />
        </>
      )}
    </div>
  );
};

export default CategoryPage;
