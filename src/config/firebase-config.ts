import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyAjiAXoBbPTijlGcDH8z5fXVakUl0Go7L8",
  authDomain: "movie-app-1b3e9.firebaseapp.com",
  projectId: "movie-app-1b3e9",
  storageBucket: "movie-app-1b3e9.appspot.com",
  messagingSenderId: "464814711044",
  appId: "1:464814711044:web:2319b49415d4210a3cf051",
  measurementId: "G-1D43B1NM5V"
};

const app = initializeApp(firebaseConfig);
export const auth= getAuth(app);
export const db= getFirestore(app);
