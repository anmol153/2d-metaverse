import { create } from "zustand";

export const useThemeStore = create((set)=>({
    sectionTarget: '',
    theme: localStorage.getItem("chat-theme") || "coffee",
    setTheme:(theme)=>{
        localStorage.setItem("chat-theme",theme)
        set({theme});
    },
    setSectionTarget: (target) => set({ sectionTarget: target })
}));