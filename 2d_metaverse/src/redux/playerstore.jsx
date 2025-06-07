
import { configureStore } from "@reduxjs/toolkit";
import playerReducer from './player.jsx' 

const playerStore = configureStore({
  reducer: {
    player: playerReducer,
  },
});
export default playerStore;
