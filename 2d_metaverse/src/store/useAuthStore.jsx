import { create } from "zustand";
import { axiosToInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


const BASE_URL  = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";
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
        get().connectSocket();
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
        get().connectSocket();
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
        get().connectSocket();
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
        get().disconnectSocket();
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
  connectSocket: ()=>{
    const {authUser,onlineUser} = get();
    if(!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL,{
      query:{
        userId:authUser._id
      }}
    );
    socket.connect();
    set({socket:socket});

    socket.on("getOnlineUser",(user)=>{
    set({onlineUser:user});
    console.log(onlineUser);
    })
  },
  disconnectSocket: ()=>{
    if(get().socket?.connected) get().socket.disconnect();
  }
}));
