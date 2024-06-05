import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import axios from 'axios';

interface CastCarouselProps {
  title: string;
  URL: string;
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

export const CastCarousel: React.FC<CastCarouselProps> = ({ title, URL }) => {
  const [cast, setCast] = useState<Cast[]>([]);
  const [scrollIndex, setScrollIndex] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6); // Default value for large screens

  useEffect(() => {
    const fetchCast = async () => {
      try {
        const response = await axios.get(URL);
        const mainCast = response.data.cast.slice(0, 10); // Display only the first 10 cast members
        setCast(mainCast);
      } catch (error) {
        console.error('Error fetching cast:', error);
      }
    };
    fetchCast();
  }, [URL]);

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
    setScrollIndex((prevIndex) => (prevIndex + itemsPerPage >= cast.length ? 0 : prevIndex + itemsPerPage));
  };

  const handlePrevious = () => {
    setScrollIndex((prevIndex) => (prevIndex - itemsPerPage < 0 ? cast.length - itemsPerPage : prevIndex - itemsPerPage));
  };

  return (
    <div className="mt-[5px]">
      <Carousel >
        <CarouselContent
          className="bg-zinc-950 ml-1 flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${scrollIndex * (100 / itemsPerPage)}%)` }}
        >
          {cast.map((member) => (
            <CarouselItem key={member.id} style={{ flex: `0 0 ${100 / itemsPerPage}%` }}>
              <div className="relative p-1 group">
                <Card className="bg-zinc-950 border-zinc-900">
                  <CardContent className="flex flex-col items-center justify-center ">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                      alt={member.name}
                      className="object-cover h-48 w-32"
                    />
                    <div className="text-white text-center mt-2">
                      <p className="text-sm font-bold">{member.name}</p>
                      <p className="text-xs">{member.character}</p>
                    </div>
                  </CardContent>
                </Card>
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
