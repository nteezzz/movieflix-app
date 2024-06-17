import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../config/firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export interface Genre {
  id: number;
  name: string;
  visits: number;
}

interface genre {
  id: number;
  name: string;
}

interface ActivityState {
  movieGenre: Genre[];
  tvGenre: Genre[];
}

const initialState: ActivityState = {
  movieGenre: [],
  tvGenre: [],
};

export const fetchActivity = createAsyncThunk(
  'activity/fetchActivity',
  async (userId: string, { rejectWithValue }) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const activityData = docSnap.data().activity || { movieGenre: [], tvGenre: [] };
        activityData.movieGenre.sort((a: Genre, b: Genre) => b.visits - a.visits);
        activityData.tvGenre.sort((a: Genre, b: Genre) => b.visits - a.visits);
        return activityData;
      } else {
        return { movieGenre: [], tvGenre: [] };
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// export const updateActivityInFirestore = createAsyncThunk(
//   'activity/updateActivityInFirestore',
//   async ({ userId, activity }: { userId: string; activity: ActivityState }, { rejectWithValue }) => {
//     try {
//       const docRef = doc(db, 'users', userId);
//       await updateDoc(docRef, {
//         activity
//       });
//       return activity;
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const trackActivityInFirestore = createAsyncThunk(
  'activity/trackActivityInFirestore',
  async ({ userId, type, genre }: { userId: string; type: 'movie' | 'tv'; genre: genre }, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(trackActivity({ type, genre }));
      const state = getState() as { activity: ActivityState };
      const updatedActivity = state.activity;
      const docRef = doc(db, 'users', userId);
          await updateDoc(docRef, {
            activity: updatedActivity
          });

      return updatedActivity;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
    
  }
);

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    trackActivity: (state, action: PayloadAction<{ type: 'movie' | 'tv'; genre: genre }>) => {
      const { type, genre } = action.payload;
      const genreArray = type === 'movie' ? state.movieGenre : state.tvGenre;
      const existingGenre = genreArray.find(g => g.id === genre.id);

      if (existingGenre) {
        existingGenre.visits += 1;
      } else {
        genreArray.push({ ...genre, visits: 1 });
      }
    },
    clearActivity: (state) => {
      state.movieGenre = [];
      state.tvGenre = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivity.fulfilled, (state, action: PayloadAction<ActivityState>) => {
        state.movieGenre = action.payload.movieGenre;
        state.tvGenre = action.payload.tvGenre;
      })
      // .addCase(updateActivityInFirestore.fulfilled, (state, action: PayloadAction<ActivityState>) => {
      //   state.movieGenre = action.payload.movieGenre;
      //   state.tvGenre = action.payload.tvGenre;
      // })
      .addCase(trackActivityInFirestore.fulfilled, (state, action: PayloadAction<ActivityState>) => {
        state.movieGenre = action.payload.movieGenre;
        state.tvGenre = action.payload.tvGenre;
      });
  }
});

export const { trackActivity, clearActivity } = activitySlice.actions;
export default activitySlice.reducer;
