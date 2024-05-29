import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaBars } from "react-icons/fa";

export const NavMenu: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-zinc-950"><FaBars size={20}/></Button>
      </SheetTrigger>
      <SheetContent className="bg-zinc-900 text-white w-128" side="left">
        <SheetHeader>
          <SheetTitle className="bg-zinc-900 text-2xl mt-[10px] text-white">NteezFlix</SheetTitle>
          <SheetDescription>
            <nav>
              <ul className="space-y-4 mt-[10px]">
                <li>
                  <Link to="/" className="text-white hover:text-gray-300">Home</Link>
                </li>
                <li>
                  <Link to="/movies" className="text-white hover:text-gray-300">Movies</Link>
                </li>
                <li>
                  <Link to="/series" className="text-white hover:text-gray-300">Series</Link>
                </li>
                <li>
                  <Link to="/popular" className="text-white hover:text-gray-300">Popular Now</Link>
                </li>
                <li>
                  <Link to="/toprated" className="text-white hover:text-gray-300">Top rated</Link>
                </li>
                <li>
                  <Link to="/nowplaying" className="text-white hover:text-gray-300">Now playing/Airing</Link>
                </li>
                <li>
                  <Link to="/mylist" className="text-white hover:text-gray-300">My WatchList</Link>
                </li>
              </ul>
            </nav>
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
