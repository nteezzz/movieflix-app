import { useCallback  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/app/store";
import { addItemToFirestore, removeItemFromFirestore } from "@/redux/slice/watchlistSlice";
import { WatchlistItem } from '@/lib/helper';
import { toast } from "sonner"
import { useAuthDialog } from "@/components/AuthComponent/authContext";


export const useWatchlist = () => {
  const uid = useSelector((state: RootState) => state.auth.uid);
  const dispatch = useDispatch<AppDispatch>();
  const {setDialogOpen}=useAuthDialog()

  const handleAddToWatchList = useCallback((item: WatchlistItem) => {
    const userId = uid || "";
    if (!uid) {
      
      toast("Please Login to add items to watchlist", {
        description: "",
        action: {
          label: "Login",
          onClick: () => {setDialogOpen(true);},
        },
      })
      
    } else {
      dispatch(addItemToFirestore({ userId, item }))
      .unwrap()
      .then(() => {
        toast.success(`Added to your watchlist`, {
          description: `${item.title}`,
          action: {
            label: "Undo",
            onClick: () => dispatch(removeItemFromFirestore({ userId: uid, itemId: item.id })),
          },
        })
      })
      .catch((error) => {
        toast("Unable to add item to your watchlist", {
          description: `${error.message}`,
        })
      });
      
    }
  }, [dispatch, uid]);

  return handleAddToWatchList;
};
