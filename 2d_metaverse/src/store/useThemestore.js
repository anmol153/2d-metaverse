import { create } from "zustand";

export const useThemeStore = create((set)=>({
    sectionTarget: '',
    velocity : 5,
    theme: localStorage.getItem("chat-theme") || "coffee",
    setTheme:(theme)=>{
        localStorage.setItem("chat-theme",theme)
        set({theme});
    },
    setSectionTarget: (target) => set({ sectionTarget: target }),
    setVelocity : (target) => set({velocity:Number(target)})
}));