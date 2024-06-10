import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/app/store";
import { addItemToFirestore } from "@/redux/slice/watchlistSlice";
import { WatchlistItem } from '@/lib/helper';

export const useWatchlist = () => {
  const uid = useSelector((state: RootState) => state.auth.uid);
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToWatchList = useCallback((item: WatchlistItem) => {
    const userId = uid || "";
    console.log(item);
    if (!uid) {
      alert("Please Login to add items to watchlist");
    } else {
      dispatch(addItemToFirestore({ userId, item }));
    }
  }, [dispatch, uid]);

  return handleAddToWatchList;
};
