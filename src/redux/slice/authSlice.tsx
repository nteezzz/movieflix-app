import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    uid: string | null;
    email: string | null;
}

const initialState: AuthState = {
    uid: null,
    email: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLogin: (state, action: PayloadAction<{ uid: string, email: string }>) => {
            state.uid = action.payload.uid;
            state.email = action.payload.email;
        },
        setLogout: (state) => {
            state.uid = null;
            state.email = null;
        },
    },
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;
