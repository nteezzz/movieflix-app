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
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa';
import '@/components/Carousels/carousel.css';
import { Skeleton } from "@/components/ui/skeleton"; 
import { useWatchlist } from '@/lib/hooks/useWatchlist';

interface ListCarouselProps {
  title: string;
  redirect: string;
  URL: string;
}

interface Item {
  id: number;
  title?: string;
  poster_path: string;
  overview: string;
  name?: string;
  media_type: 'movie' | 'tv';
}

export const ListCarousel: React.FC<ListCarouselProps> = ({ title, redirect, URL }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [scrollIndex, setScrollIndex] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(true); 
  const handleAddToWatchList = useWatchlist();

  useEffect(() => {
    const fetchItems = async (page: number) => {
      try {
        const response = await axios.get(`${URL}&page=${page}`);
        setItems((prevItems) => [...prevItems, ...response.data.results]);
        setTotalPages(response.data.total_pages);
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems(currentPage);
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
        <Link to={`/${redirect}`}className="px-4 py-2">
          {title}
        </Link>
      </div>

      <Carousel className="w-full">
        <CarouselContent
          className="bg-zinc-950 ml-1 flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${scrollIndex * (100 / itemsPerPage)}%)` }}
        >
          {loading ? (
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <CarouselItem key={index} style={{ flex: `0 0 ${100 / itemsPerPage}%` }}>
                <div className="relative p-1 group card-container">
                  <Card className="bg-zinc-950 border-zinc-900 card-hover">
                    <CardContent className="flex aspect-auto items-center justify-center">
                      <Skeleton className="object-cover w-full h-full animate-pulse" />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))
          ) : (
            items.map((item) => (
              <CarouselItem key={item.id} style={{ flex: `0 0 ${100 / itemsPerPage}%` }}>
                <div className="relative p-1 group card-container">
                  <Link to={`/${item.media_type === 'movie' ? 'movies' : 'series'}/${item.id}`}>
                    <Card className="bg-zinc-950 border-zinc-900 card-hover">
                      <CardContent className="flex aspect-auto items-center justify-center">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                          alt={item.title || item.name}
                          className="object-cover h-full w-full rounded-md"
                        />
                      </CardContent>
                    </Card>
                  </Link>
                  <Button
                    onClick={() => handleAddToWatchList({
                      id: item.id,
                      title: item.media_type=='movie'?(item.title||" "):(item.name||" "),
                      type: item.media_type,
                    })}
                    className="absolute h-[30px] bottom-2 right-2 transform bg-zinc-800 px-[8px] py-[8px] text-white lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <FaPlus />
                  </Button>
                </div>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <CarouselPrevious onClick={handlePrevious} className="bg-zinc-900 border-zinc-900" />
        <CarouselNext onClick={handleNext} className="bg-zinc-900 border-zinc-900" />
      </Carousel>
    </div>
  );
};
