import React, { useState} from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase-config';
import { fetchWatchlist } from '@/redux/slice/watchlistSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/app/store';
import { setLogin } from '@/redux/slice/authSlice';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FaSignOutAlt } from 'react-icons/fa';

const AuthComponent: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const uid = useSelector((state: RootState) => state.auth.uid);
  const mail=useSelector((state: RootState) => state.auth.email);

  

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
        setDialogOpen(false)
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
      alert(`User signed in: ${userCredential.user.email}`);
      const { uid, email: userEmail } = userCredential.user;

      if (userEmail && uid) {
        dispatch(setLogin({ uid, email: userEmail }));
        dispatch(fetchWatchlist(uid));
      }
      console.log(userCredential.user);
      setDialogOpen(false)
    } catch (error: any) {
      if (error.code === 'auth/network-request-failed') {
        alert("Network error: Please check your internet connection and try again.");
      } else {
        alert(`Sign in error: ${error.message}`);
      }
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert('User signed out');
    } catch (error: any) {
      alert(`Sign out error: ${error.message}`);
      console.error(error);
    }
  };

  const handleGuest = () => {
    alert("Dear guest user, all your data will be lost once the browser is closed/refreshed");
    setDialogOpen(false)
  };

  return (
    <>
      {uid ? (
        <div className="flex items-center space-x-4">
          <span>{mail}</span>
          <Button className="m-[5px]" onClick={handleSignOut}>
            <FaSignOutAlt />
          </Button>
        </div>
      ) : (
        <Dialog open={dialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={()=>setDialogOpen(true)}>Login to Your Account</Button>
        </DialogTrigger>
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

        )}
    </>
  );
};

export default AuthComponent;
