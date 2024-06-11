import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { API_KEY } from '@/config';
import { HeroCarouselCard } from './heroCarouselCard';
import { Skeleton } from '@/components/ui/skeleton';

export interface Movie {
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

export interface Show {
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

interface HeroCarouselProps {
  movieURL: string;
  tvURL: string;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ movieURL, tvURL }) => {
  const [items, setItems] = useState<(Movie | Show)[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [trailerMode, setTrailerMode] = useState<boolean>(false);
  const autoplayRef = useRef<any>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(movieURL);
        const movies = response.data.results.map((movie: Movie) => ({ ...movie, type: 'movie' }));
        return movies;
      } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
      }
    };

    const fetchShows = async () => {
      try {
        const response = await axios.get(tvURL);
        const shows = response.data.results.map((show: Show) => ({ ...show, type: 'tv' }));
        return shows;
      } catch (error) {
        console.error('Error fetching shows:', error);
        return [];
      }
    };

    const fetchTrailer = async (id: number, type: 'movie' | 'tv') => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}`);
        const trailer = response.data.results.find((video: any) => video.type === 'Trailer' && video.site === 'YouTube');
        return trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=0&showinfo=0` : null;
      } catch (error) {
        console.error('Error fetching trailer:', error);
        return null;
      }
    };

    const fetchDetails = async (items: (Movie | Show)[]) => {
      const detailedItems = await Promise.all(
        items.map(async (item) => {
          if (item.type === 'movie') {
            const [detailsResponse, trailerUrl] = await Promise.all([
              axios.get(`https://api.themoviedb.org/3/movie/${item.id}?api_key=${API_KEY}`),
              fetchTrailer(item.id, 'movie')
            ]);
            return { ...item, runtime: detailsResponse.data.runtime, trailer: trailerUrl };
          } else {
            const [detailsResponse, trailerUrl] = await Promise.all([
              axios.get(`https://api.themoviedb.org/3/tv/${item.id}?api_key=${API_KEY}`),
              fetchTrailer(item.id, 'tv')
            ]);
            return { ...item, number_of_seasons: detailsResponse.data.number_of_seasons, trailer: trailerUrl };
          }
        })
      );
      setItems(detailedItems);
      setLoading(false);
    };

    const fetchData = async () => {
      setLoading(true);
      const movies = await fetchMovies();
      const shows = await fetchShows();
      const combined = [...movies, ...shows];
      await fetchDetails(combined);
    };

    fetchData();
  }, [movieURL, tvURL]);

  const HeroCarouselCardSkeleton = () => (
    <div className="flex">
      <Skeleton className="h-[400px] w-[1080px] rounded-xl" />
    </div>
  );

  const handleMouseEnter = (id: number) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoveredItem(id);
    autoplayRef.current?.stop();
    setHoverTimeout(
      setTimeout(() => {
        setTrailerMode(true);
        console.log(`Playing trailer for item with id: ${id}`);
      }, 2000)
    );
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoveredItem(null);
    setTrailerMode(false);
    console.log(`Pausing trailer`);
    autoplayRef.current?.play();
  };

  return (
    <div className="mt-5">
      <Carousel
        plugins={[
          Autoplay({ delay: 3000, stopOnInteraction: false,stopOnMouseEnter: true, ref: autoplayRef })
        ]}
      >
        <CarouselContent className="bg-zinc-950">
          {loading ? (
            HeroCarouselCardSkeleton()
          ) : (
            items.map((item) => (
              <CarouselItem
                key={item.id}
                className="group h-96 xl:h-[400px] 2xl:h-[500px] rounded-md"
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <HeroCarouselCard item={item} trailerMode={trailerMode && hoveredItem === item.id} />
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <CarouselPrevious className="bg-zinc-900 border-zinc-900" />
        <CarouselNext className="bg-zinc-900 border-zinc-900" />
      </Carousel>
    </div>
  );
};
