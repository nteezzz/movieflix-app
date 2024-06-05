import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent} from "@/components/ui/card";
import StarRating from "../../components/StarRating/starRating";
import { API_KEY } from '@/config';
import { CastCarousel } from '../../components/Carousels/CastCarousel/castCarousel';

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  release_date: string;
  genres: Genre[];
  vote_average: number;
  vote_count: number;
  runtime?: number;
  status: string;
  original_language: string;
  credits: {
    cast: Cast[];
    crew: Crew[];
  };
  type: 'movie';
}

interface Show {
  id: number;
  name: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  first_air_date: string;
  genres: Genre[];
  vote_average: number;
  vote_count: number;
  number_of_seasons?: number;
  status: string;
  original_language: string;
  credits: {
    cast: Cast[];
    crew: Crew[];
  };
  type: 'show';
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

interface Crew {
  name: string;
  job: string;
}

export const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Movie | Show | null>(null);
  const isMovie = window.location.pathname.includes('/movies/');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/${isMovie ? 'movie' : 'tv'}/${id}?api_key=${API_KEY}&append_to_response=credits`
        );
        const data = response.data;
        setItem({ ...data, type: isMovie ? 'movie' : 'show' });
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchDetails();
  }, [id, isMovie]);

  const getGenreNames = (genres: Genre[]): string[] => {
    return genres.map((genre) => genre.name);
  };

  const getCrewMember = (crew: Crew[], job: string): string => {
    const member = crew.find((person) => person.job === job);
    return member ? member.name : 'Unknown';
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-zinc-950 border-zinc-900 mx-auto mb-6 max-w-6xl">
        <CardContent className="flex flex-col md:flex-row">
          
          
          <img
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={item.type === 'movie' ? item.title : item.name}
            className="object-cover  h-full w-full md:w-1/3 "
          />
          
          <div className="p-4 w-full text-left md:w-2/3">
            <h1 className="text-white font-bold text-2xl">
              {item.type === 'movie' ? item.title : item.name}{" "}
              {item.type === 'movie' ? 
                `(${item.release_date.substring(0, 4)})` : 
                `(${item.first_air_date.substring(0, 4)})`}
            </h1>
            <div className="text-white mt-2">
              <StarRating rating={item.vote_average} count={item.vote_count} />
            </div>
            <div className="text-white mt-2">
              {item.type === 'movie' ? `${item.runtime} mins` : `${item.number_of_seasons} Seasons`}
            </div>
            <div className="text-white mt-2">
              {getGenreNames(item.genres).join(", ")}
            </div>
            <p className="text-white mt-2">
              {item.overview}
            </p>
            <div className="text-white mt-2">
              Released: {item.type === 'movie' ? item.release_date : item.first_air_date}
            </div>
            <div className="text-white mt-2">
              Status: {item.status}
            </div>
            <div className="text-white mt-2">
              Language: {item.original_language.toUpperCase()}
            </div>
            <div className="text-white mt-2">
              Director: {getCrewMember(item.credits.crew, 'Director')}
            </div>
            <div className="text-white mt-2">
              Cinematographer: {getCrewMember(item.credits.crew, 'Director of Photography')}
            </div>
            <div className="text-white mt-2">
              Music: {getCrewMember(item.credits.crew, 'Original Music Composer')}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="max-w-6xl mx-[24px]">
        <CastCarousel title="Cast" URL={`https://api.themoviedb.org/3/${isMovie ? 'movie' : 'tv'}/${id}/credits?api_key=${API_KEY}`} />
      </div>
    </div>
  );
};
