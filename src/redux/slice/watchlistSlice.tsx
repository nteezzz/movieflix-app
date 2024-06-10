import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../config/firebase-config';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

interface WatchlistItem {
  id: number;
  title: string;
  type: 'movie' | 'tv';
}

interface WatchlistState {
  watchlist: WatchlistItem[];
}

const initialState: WatchlistState = {
  watchlist: [],
};

// Thunks for Firestore operations
export const fetchWatchlist = createAsyncThunk(
  'watchlist/fetchWatchlist',
  async (userId: string, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().watchlist || [];
      } else {
        return [];
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addItemToFirestore = createAsyncThunk(
  'watchlist/addItemToFirestore',
  async ({ userId, item }: { userId: string; item: WatchlistItem }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        watchlist: arrayUnion(item)
      });
      return item;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeItemFromFirestore = createAsyncThunk(
  'watchlist/removeItemFromFirestore',
  async ({ userId, itemId }: { userId: string; itemId: number }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const watchlist = docSnap.data().watchlist as WatchlistItem[];
        const itemToRemove = watchlist.find(item => item.id === itemId);

        if (itemToRemove) {
          await updateDoc(docRef, {
            watchlist: arrayRemove(itemToRemove)
          });
          return itemId;
        } else {
          throw new Error('Item not found in watchlist');
        }
      } else {
        throw new Error('User document not found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<WatchlistItem>) {
      state.watchlist.push(action.payload);
    },
    removeItem(state, action: PayloadAction<{ id: number }>) {
      state.watchlist = state.watchlist.filter(item => item.id !== action.payload.id);
    },
    setWatchlist(state, action: PayloadAction<WatchlistItem[]>) {
      state.watchlist = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlist.fulfilled, (state, action: PayloadAction<WatchlistItem[]>) => {
        state.watchlist = action.payload;
      })
      .addCase(addItemToFirestore.fulfilled, (state, action: PayloadAction<WatchlistItem>) => {
        state.watchlist.push(action.payload);
      })
      .addCase(removeItemFromFirestore.fulfilled, (state, action: PayloadAction<number>) => {
        state.watchlist = state.watchlist.filter(item => item.id !== action.payload);
      });
  }
});

export const { addItem, removeItem, setWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
