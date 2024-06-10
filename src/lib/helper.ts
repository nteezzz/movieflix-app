interface Genre {
    id: number;
    name: string;
  }
  
  export interface WatchlistItem {
    id: number;
    title: string;
    type: 'movie' | 'tv';
  }
  
  export const getMovieGenres = (moviegenres: Genre[], genreIds: number[]): string[] => {
    return genreIds.map((id) => {
      const genre = moviegenres.find((genre) => genre.id === id);
      return genre ? genre.name : "";
    });
  };
  
  export const getTVGenres = (tvgenres: Genre[], genreIds: number[]): string[] => {
    return genreIds.map((id) => {
      const genre = tvgenres.find((genre) => genre.id === id);
      return genre ? genre.name : "";
    });
  };
  
  export const truncateOverview = (overview: string, maxWords: number): string => {
    const words = overview.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    } else {
      return overview;
    }
  };
  