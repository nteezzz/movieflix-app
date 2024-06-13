import React, { useState, useEffect} from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase-config';
import { fetchWatchlist } from '@/redux/slice/watchlistSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/app/store';
import { setLogin, setLogout } from '@/redux/slice/authSlice';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { useAuthDialog } from './authContext';
import { fetchActivity } from '@/redux/slice/activitySlice';


const AuthComponent: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const { dialogOpen, setDialogOpen } = useAuthDialog();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email } = user;
        if (email) {
          dispatch(setLogin({ uid, email }));
          dispatch(fetchWatchlist(uid));
          dispatch(fetchActivity(uid));
        }
      } else {
        dispatch(setLogout());
        setDialogOpen(false); 
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const uid = user.uid;
      await setDoc(doc(db, "users", uid), { email });
      alert("User registered");
      if (email && uid) {
        dispatch(setLogin({ uid, email }));
        dispatch(fetchWatchlist(uid));
        dispatch(fetchActivity(uid));
        setDialogOpen(false); 
      }
    } catch (error: any) {
      if (error.code === 'auth/network-request-failed') {
        alert("Network error: Please check your internet connection and try again.");
      } else {
        alert(`Sign up error: ${error.message}`);
      }
      console.error(error);
    }
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success(`User signed in: `, {
        description: `${userCredential.user.email}`,
      });
     
      const { uid, email: userEmail } = userCredential.user;
      if (userEmail && uid) {
        dispatch(setLogin({ uid, email: userEmail }));
        dispatch(fetchWatchlist(uid));
        dispatch(fetchActivity(uid));
        setDialogOpen(false); 
      }
    } catch (error: any) {
      if (error.code === 'auth/network-request-failed') {
        toast.error("Network error: ", {
          description: ' Please check your internet connection and try again.',
        });
      } else {
        toast.error("Sign in error: ", {
          description:`${error.message}`,
        });
      }
      console.error(error);
    }
  };


  const handleGuest = () => {
    toast('Dear guest user', { description:"All your data will be lost once the browser is closed/refreshed" });
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="border-custom-red bg-zinc-900 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <div className="text-center">{isRegistering ? 'Create a new account' : 'Login to your account'}</div>
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="flex flex-col items-center w-full">
          <form onSubmit={isRegistering ? handleSignUp : handleSignIn} className="w-full px-4">
            <div className="flex flex-col w-full">
              <Input
                className="m-[5px] bg-zinc-700 border-custom-red text-white"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <Input
                className="m-[5px] bg-zinc-700 text-white"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <div className="flex justify-between w-full">
              <Button className="m-[5px] w-1/4 bg-red-800" type="submit">
                {isRegistering ? 'Register' : 'Login'}
              </Button>
              <Button
                className="text-white"
                variant="link"
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
              </Button>
            </div>
          </form>
          <div className="flex justify-center w-full my-2">Or</div>
          <DialogFooter className="w-full px-4">
            <Button className="m-[5px] w-full bg-zinc-700 text-white" onClick={handleGuest}>
              Continue as Guest
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthComponent;
