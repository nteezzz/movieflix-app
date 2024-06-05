import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase-config';
import { fetchWatchlist } from '@/redux/slice/watchlistSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/app/store';
import { setLogin } from '@/redux/slice/authSlice';

const AuthComponent: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();
    const watchlist = useSelector((state: RootState) => state.watchlist);

    const handleSignUp = async () => {
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            const uid = user.uid;
            await setDoc(doc(db, "users", uid), { email });
            alert("User registered");
            if (email && uid) { // Type guard to ensure email and uid are not null
                dispatch(setLogin({ uid, email }));
                dispatch(fetchWatchlist(uid));
            }
        } catch (error: any) {
            alert(`Sign up error: ${error.message}`);
            console.error(error);
        }
    };

    const handleSignIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            alert(`User signed in: ${userCredential.user.email}`);
            const { uid, email: userEmail } = userCredential.user;
            if (userEmail && uid) { // Type guard to ensure email and uid are not null
                dispatch(setLogin({ uid, email: userEmail }));
                dispatch(fetchWatchlist(uid));
            }
            console.log(userCredential.user);
        } catch (error: any) {
            alert(`Sign in error: ${error.message}`);
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

    return (
        <div>
            <h1>Firebase Authentication</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignUp}>Sign Up</button>
            <button onClick={handleSignIn}>Sign In</button>
            <button onClick={handleSignOut}>Sign Out</button>
            
            <div>
                <h2>Watchlist</h2>
                <ul>
                    {watchlist.watchlist.map(item => (
                        <li key={item.id}>{item.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AuthComponent;
