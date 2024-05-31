import React, { useEffect, useState } from 'react';
import { ListCarousel } from '@/components/ListCarousel/listCarousel';

interface MoviesShowsPageProps {
  category: 'movies' | 'shows';
}

const MoviesShowsPage: React.FC<MoviesShowsPageProps> = ({ category }) => {
  const [popularURL, setPopularURL] = useState<string>('');
  const [topRatedURL, setTopRatedURL] = useState<string>('');
  const [nowShowingURL, setNowShowingURL] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const apiKey = '8e3b0e2988fbbca50323caff26dfd237'; // Replace with your TMDb API key
  const baseURL = 'https://api.themoviedb.org/3';

  useEffect(() => {
    switch (category) {
      case 'movies':
        setPopularURL(`${baseURL}/movie/popular?api_key=${apiKey}&language=en-US&page=1`);
        setTopRatedURL(`${baseURL}/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`);
        setNowShowingURL(`${baseURL}/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`);
        break;
      case 'shows':
        setPopularURL(`${baseURL}/tv/popular?api_key=${apiKey}&language=en-US&page=1`);
        setTopRatedURL(`${baseURL}/tv/top_rated?api_key=${apiKey}&language=en-US&page=1`);
        setNowShowingURL(`${baseURL}/tv/on_the_air?api_key=${apiKey}&language=en-US&page=1`);
        break;
      default:
        throw new Error('Invalid category');
    }
    setLoading(false);
  }, [category]);

  return (
    <div className="flex flex-col mx-[48px] min-h-screen bg-zinc-950 text-white">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ListCarousel key={`${category}-popular`} title={`Popular ${category}`} URL={popularURL} />
          <ListCarousel key={`${category}-toprated`} title={`Top Rated ${category}`} URL={topRatedURL} />
          <ListCarousel key={`${category}-nowshowing`} title={`Now Playing ${category}`} URL={nowShowingURL} />
        </>
      )}
    </div>
  );
};

export default MoviesShowsPage;
