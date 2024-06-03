import React from 'react';
import { NavMenu } from '../NavMenu/navMenu';
import { SearchComponent } from '../Search/searchComponent';

export const MovieHeader: React.FC = () => {


  return (
    <header className="flex justify-between bg-zinc-950 text-white items-center p-1">
      <div className="flex items-center">
        <NavMenu />
        <span className="text-red-800  font-bold ml-4 text-2xl">NteezFlix</span>
      </div>
      <SearchComponent/>
    </header>
  );
};
