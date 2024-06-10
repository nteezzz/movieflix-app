import React, { useEffect, useState } from 'react';
import { ListCarousel } from '@/components/Carousels/ListCarousel/listCarousel';
import { API_KEY } from '@/config';

interface MoviesShowsPageProps {
  category: 'movies' | 'shows';
}

const MoviesShowsPage: React.FC<MoviesShowsPageProps> = ({ category }) => {
  const [popularURL, setPopularURL] = useState<string>('');
  const [topRatedURL, setTopRatedURL] = useState<string>('');
  const [nowShowingURL, setNowShowingURL] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const baseURL = 'https://api.themoviedb.org/3';
  const [carouselKey, setCarouselKey] = useState<number>(0); 

  useEffect(() => {
    switch (category) {
      case 'movies':
        setPopularURL(`${baseURL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
        setTopRatedURL(`${baseURL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`);
        setNowShowingURL(`${baseURL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`);
        break;
      case 'shows':
        setPopularURL(`${baseURL}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`);
        setTopRatedURL(`${baseURL}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`);
        setNowShowingURL(`${baseURL}/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=1`);
        break;
      default:
        throw new Error('Invalid category');
    }
    setLoading(false);
    setCarouselKey((prevKey) => prevKey + 1);
  }, [category]);

  return (
    <div className="flex flex-col mx-[48px] min-h-screen bg-zinc-950 text-white">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ListCarousel key={`popular${category}-${carouselKey}`} redirect='popular' title={`Popular ${category}`} URL={popularURL} />
          <ListCarousel key={`toprated${category}-${carouselKey}`} redirect='topRated' title={`Top Rated ${category}`} URL={topRatedURL} />
          <ListCarousel key={`nowshowing${category}-${carouselKey}`} redirect='nowShowing'title={`Now Playing ${category}`} URL={nowShowingURL} />
        </>
      )}
    </div>
  );
};

export default MoviesShowsPage;
