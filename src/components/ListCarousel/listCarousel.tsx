import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
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
  URL: string;
}
interface Item {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
}

export const ListCarousel: React.FC<ListCarouselProps> = ({ title, URL }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [scrollIndex, setScrollIndex] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6); // Default value for large screens
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchMovies = async (page: number) => {
      try {
        const response = await axios.get(`${URL}&page=${page}`);
        setItems((prevItems) => [...prevItems, ...response.data.results]);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies(currentPage);
  }, [URL, currentPage]);

  const updateItemsPerPage = () => {
    const width = window.innerWidth;
    if (width >= 1200) {
      setItemsPerPage(6);
    } else if (width >= 992) {
      setItemsPerPage(4);
    } else if (width >= 768) {
      setItemsPerPage(3);
    } else {
      setItemsPerPage(2);
    }
  };

  useEffect(() => {
    updateItemsPerPage(); 
    window.addEventListener('resize', updateItemsPerPage); 

    return () => {
      window.removeEventListener('resize', updateItemsPerPage);
    };
  }, []);

  const handleNext = () => {
    if (scrollIndex + itemsPerPage >= items.length) {
      if (currentPage < totalPages) {
        setCurrentPage((prevPage) => prevPage + 1);
      } else {
        setScrollIndex(0);
      }
    } else {
      setScrollIndex((prevIndex) => prevIndex + itemsPerPage);
    }
  };

  const handlePrevious = () => {
    setScrollIndex((prevIndex) =>
      prevIndex - itemsPerPage < 0 ? items.length - itemsPerPage : prevIndex - itemsPerPage
    );
  };

  return (
    <div className="mt-[5px]">
      <div className="flex text-lg m-[5px] justify-self-start">
        <Link to="/" className="px-4 py-2">
          {title}
        </Link>
      </div>

      <Carousel className="w-full">
        <CarouselContent
          className="bg-zinc-950 ml-1 flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${scrollIndex * (100 / itemsPerPage)}%)` }}
        >
          {items.map((item) => (
            <CarouselItem key={item.id} style={{ flex: `0 0 ${100 / itemsPerPage}%` }}>
              <div className="p-1">
                <Link to={`/${item.title ? 'movies' : 'series'}/${item.id}`}>
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
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious onClick={handlePrevious} className="bg-zinc-900 border-zinc-900" />
        <CarouselNext onClick={handleNext} className="bg-zinc-900 border-zinc-900" />
      </Carousel>
    </div>
  );
};
