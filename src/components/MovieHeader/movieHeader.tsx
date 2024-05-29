import React from 'react';
import {  FaSearch } from 'react-icons/fa';
import { NavMenu } from '../NavMenu/navMenu';
import { Button } from '../ui/button';

export const MovieHeader: React.FC = () => {


  return (
    <header className="flex justify-between bg-zinc-950 text-white items-center p-1">
      <div className="flex items-center">
        <NavMenu />
        <span className="text-red-800  font-bold ml-4 text-2xl">NteezFlix</span>
      </div>
      <Button className="bg-zinc-950">
        <FaSearch />
      </Button>
    </header>
  );
};
