import { createSlice} from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false,
    error: null,
    player: null,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signOut: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        id:(state,action) =>{
            state.player = action.payload;
        }
    }
})

export const { signInStart, signInSuccess, signInFailure, signOut,id} = userSlice.actions;
export default userSlice.reducer;