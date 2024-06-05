import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice';
import watchlistReducer from '../slice/watchlistSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    watchlist: watchlistReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
