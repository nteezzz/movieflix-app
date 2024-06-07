
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaBars } from "react-icons/fa";
import AuthComponent from '../AuthComponent/authComponent';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/app/store';



export const NavMenu: React.FC = () => {
  const auth=useSelector((state: RootState) => state.auth.uid)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-zinc-950"><FaBars size={20} /></Button>
      </SheetTrigger>
      <SheetContent className="bg-zinc-900 text-white lg:w-1/4 md:w-1/3 sm:w-full flex flex-col" side={'left'}>
        <div className="flex-grow">
          <SheetHeader>
            <SheetTitle className="bg-zinc-900 text-2xl mt-[10px] text-white">NteezFlix</SheetTitle>
          </SheetHeader>
          <SheetDescription>
            <nav>
              <ul className="space-y-4 mt-[10px]">
                <li>
                  <SheetClose asChild>
                    <Link to="/" className="text-white hover:text-gray-300">Home</Link>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <Link to="/movies" className="text-white hover:text-gray-300">Movies</Link>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <Link to="/series" className="text-white hover:text-gray-300">Series</Link>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <Link to="/popular" className="text-white hover:text-gray-300">Popular Now</Link>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <Link to="/topRated" className="text-white hover:text-gray-300">Top rated</Link>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <Link to="/nowPlaying" className="text-white hover:text-gray-300">Now playing/Airing</Link>
                  </SheetClose>
                </li>
                {auth && (
                  <li>
                    <SheetClose asChild>
                      <Link to="/myWatchlist" className="text-white hover:text-gray-300">My WatchList</Link>
                    </SheetClose>
                  </li>
                )}
              </ul>
            </nav>
          </SheetDescription>
        </div>
        <div className="mt-auto">
          <AuthComponent />
        </div>
      </SheetContent>
    </Sheet>
  );
};
