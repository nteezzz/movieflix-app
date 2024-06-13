import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice';
import watchlistReducer from '../slice/watchlistSlice';
import activityReducer from '../slice/activitySlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    watchlist: watchlistReducer,
    activity:activityReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
