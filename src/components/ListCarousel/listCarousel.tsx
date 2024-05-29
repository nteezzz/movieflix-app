import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
//import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import axios from 'axios';

// Define the props for ListCarousel
interface ListCarouselProps {
  title: string;
  URL:string;
}
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;

}

export const ListCarousel: React.FC<ListCarouselProps> = ({ title, URL }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(URL);
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, []);
  return (
    <div className="mt-[5px]">
      <div className="flex text-lg m-[5px] justify-self-start">
        <Link to="/movies" className="px-4 py-2">
          {title}
        </Link>
      </div>

      <Carousel
        // plugins={[
        //   Autoplay({
        //     delay: 3000,
        //   }),
        // ]}
        className="w-full"
      >
        <CarouselContent className="bg-zinc-950 ml-1">
          {movies.map((movie) => (
            
            <CarouselItem
              key={movie.id}
              className="pl-1 sm:basis-1/2 md:basis-1/4 lg:basis-1/6"
            >
              <div className="p-1">
              <Link to={`/movies/${movie.id}`}>
                <Card className="bg-zinc-950 border-zinc-900">
                  <CardContent className="flex aspect-auto items-center justify-center p-2">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="object-cover h-full w-full"
                    />
                  </CardContent>
                </Card>
                </Link>
              </div>
            </CarouselItem>
            
          ))}
          <CarouselItem
              className="pl-1 sm:basis-1/2 md:basis-1/4 lg:basis-1/6"
            >
              <div className="p-1">
              <Link to={`/trending/movies`}>
                <Card className="bg-zinc-950 border-zinc-900">
                  <CardContent className="flex aspect-auto items-center justify-center p-2">
                    <div className="object-cover h-[222px] w-full">
                      <h2 className='text-white'>View more</h2>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              </div>
            </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="bg-zinc-900 border-zinc-900" />
        <CarouselNext className="bg-zinc-900 border-zinc-900" />
      </Carousel>
    </div>
  );
};
