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


// export const trackActivityInFirestore = createAsyncThunk(
//   'activity/trackActivityInFirestore',
//   async (
//     { userId, type, genre }: { userId: string; type: 'movie' | 'tv'; genre: genre },
//     { rejectWithValue }
//   ) => {
//     try {
//       const docRef = doc(db, 'users', userId);
//       const docSnap = await getDoc(docRef);
//       let updatedActivity: ActivityState;
//       if (docSnap.exists()) {
//         updatedActivity = (docSnap.data() as { activity: ActivityState }).activity || { movieGenre: [], tvGenre: [] };
//       } else {
//         updatedActivity = { movieGenre: [], tvGenre: [] };
//       }

//       if (type === 'movie') {
//         const existingGenre = updatedActivity.movieGenre.find(g => g.id === genre.id);
//         console.log(existingGenre)
//         if (existingGenre) {
//           console.log(existingGenre.name)
//           console.log(existingGenre.visits)
//           existingGenre.visits+= 1;
//           console.log(existingGenre.visits)
//         } else {
//           const newGenre = { id:genre.id, name:genre.name, visits:1 };
//           console.log(newGenre.name)
//           console.log(newGenre.visits)
//           updatedActivity.movieGenre.push(newGenre);
//         }
//       } else {
//         const existingGenre = updatedActivity.tvGenre.find(g => g.id === genre.id);
//         if (existingGenre) {
//           existingGenre.visits += 1;
//         } else {
//           const newGenre = { ...genre, visits: 1 };
//           updatedActivity.tvGenre.push(newGenre);
//         }
//       }
//       await updateDoc(docRef, { activity: updatedActivity });
//       return updatedActivity;
//     } catch (error: any) {
//       console.error('Error in trackActivityInFirestore:', error);
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
      .addCase(trackActivityInFirestore.fulfilled, (state, action: PayloadAction<ActivityState>) => {
        state.movieGenre = action.payload.movieGenre;
        state.tvGenre = action.payload.tvGenre;
      });
  }
});

export const { trackActivity, clearActivity } = activitySlice.actions;
export default activitySlice.reducer;
