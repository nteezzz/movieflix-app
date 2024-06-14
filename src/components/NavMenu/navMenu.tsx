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
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/app/store';
import { useAuthDialog } from '../AuthComponent/authContext';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';
import { setLogout } from '@/redux/slice/authSlice';
import { auth} from '../../config/firebase-config';



export const NavMenu: React.FC = () => {
  const uid = useSelector((state: RootState) => state.auth.uid);
  const mail = useSelector((state: RootState) => state.auth.email);
  const { setDialogOpen } = useAuthDialog();
  const dispatch = useDispatch<AppDispatch>();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast(`User signed out `, {
        description: ``,
      });
      dispatch(setLogout());
      setDialogOpen(false); 
    } catch (error: any) {
      toast.error("Sign out error: ", {
        description:`${error.message}`,
      });
    }
  };
  // const handleClearActivity=()=>{
  //   if(uid){
  //   dispatch(clearActivity());
  //   dispatch(updateActivityInFirestore({ userId: uid, activity }))
  //   }
  // }

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
                    <Link to="/topRated" className="text-white hover:text-gray-300">Top Rated</Link>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <Link to="/nowShowing" className="text-white hover:text-gray-300">Now Showing</Link>
                  </SheetClose>
                </li>
                {uid&&(<>
                  <li>
                  <SheetClose asChild>
                    <Link to="/myWatchlist" className="text-white hover:text-gray-300">My Watchlist</Link>
                  </SheetClose>
                  </li>
                </>)}
              </ul>
            </nav>
          </SheetDescription>
        </div>
        <SheetFooter>
        <div className='mt-auto'>
                {uid? (
                  <>
                  <span>{mail}</span>
                    <Button className="text-white hover:text-gray-300" onClick={handleSignOut}>
                      <FaSignOutAlt />
                    </Button>
                  </>
                ): (
                    <Button className="text-white hover:text-gray-300" onClick={() => setDialogOpen(true)}>
                      Login to Your Account
                    </Button>
                )}
                </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};


