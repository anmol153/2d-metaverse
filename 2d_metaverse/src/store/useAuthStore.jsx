import { create } from "zustand";
import { axiosToInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSignUPing: false,
  isLogining: false,
  isCheckingAuth: true,
  Error: null,
  isUpdateProfile:false,
  onlineUser:[],
  socket:[],
  checkAuth: async () => {
    try {
      const res = await axiosToInstance.get("auth/check");
      const result = res.data;

      if (result.success === true) {
        set({ authUser: result.data });
      }
    } catch (error) {
      set({ isCheckingAuth: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSignUPing: true });
    {console.log("in signup page");}
    try {
      const res = await axiosToInstance.post("/auth/sign-up", data);
      const result = res.data;
      // console.log(result);
      if (result.success === true) {
        set({ authUser: result.data });
        toast.success("User successfully signed up!");
      } else {
        toast.error(result.message || "Sign up failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      set({ isSignUPing: false });
    }
  },
  signin: async (data) => {
    set({ isLogining: true });
    try {
      const res = await axiosToInstance.post("/auth/sign-in", data);
      const result = res.data;
      // console.log(result);
      if (result.success === true) {
        set({ authUser: result.data });
        toast.success("User successfully signed in!");
      } else {
        toast.error(result.message || "Sign in failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      set({ isLogining: false });
    }
  },
  logout: async()=>{
    try {
        const res = await axiosToInstance.post("/auth/sign-out");
        const result = res.data;
        if (result.success === true) {
        set({ authUser:null});
        toast.success("User successfully logged out!");
      } 
      else {
        toast.error(result.message || "Logged out failed");
      }
    } catch (error) {
        toast.error(error.response?.data?.message || error.message || "Something went wrong");
    }
  },
  avatarupload: async(data)=>{
    try {
      set({isUpdatingProfile:true});
      const formData = new FormData();
      formData.append("avatar", data);

      const res = await axiosToInstance.post("/auth/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
      });
      const result = res.data;
       if (result.success === true) {
        set({ authUser:result.data});
        toast.success("Avatar successfully updated!");
      } 
      else {
        toast.error(result.message || "Avatar Update  failed!");
      }
    } catch (error) {
        toast.error(error.response?.data?.message || error.message || "Something went wrong");
    }
    finally{
      set({isUpdatingProfile:false});
    }
  },
  disconnectSocket: ()=>{
    if(get().socket?.connected) get().socket.disconnect();
  },
  setonlineUser : (user)=> set({onlineUser:user}),
}));
