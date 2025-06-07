import { createSlice} from "@reduxjs/toolkit";

const initialState = {
    player: [],
    error: null,
}

const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        addplayer:((state, action) => {
            state.player.push(action.payload);
        }),
        removePlayer:((state,action) =>{
            state.player.remove(action.payload);
        })
    }
})

export const {addplayer } = playerSlice.actions;
export default playerSlice.reducer;