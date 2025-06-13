import toast from "react-hot-toast";
import { axiosToInstance } from "../lib/axios";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  selectedUser: undefined,
  isUserLoading: false,
  isMessageLoading: false,
  isFriendLoading: false,
  isMessageSending: false,
  user: [],

  getUser: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosToInstance.get("/message/user");
      const result = res.data;
      if (result.success === true) {
        set({ user: result.data[0].friendlist });
        // toast.success("Users fetched successfully!");
      } else {
        toast.error(result.message || "Users not fetched successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessage: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosToInstance.get(`/message/${userId}`);
      const result = res.data;
      if (result.success === true) {
        set({ messages: result.data });
        // toast.success("Messages fetched successfully!");
      } else {
        toast.error(result.message || "Messages not fetched successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    } finally {
      set({ isMessageLoading: false });
    }
  },

  addFriend: async (Friend) => {
    set({ isFriendLoading: true });
    try {
      const res = await axiosToInstance.post("/auth/addFriend", { username: Friend });
      const result = res.data;
      if (result.success === true) {
        toast.success(`${Friend} is now your friend`);
        get().getUser();
      } else {
        toast.error(result.message || "Failed to add friend");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add friend");
      console.error(error);
    } finally {
      set({ isFriendLoading: false });
    }
  },

  sendMessage: async (formData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
      toast.error("No user selected.");
      return;
    }

    set({ isMessageSending: true });

    try {
      const res = await axiosToInstance.post(`/message/${selectedUser._id}`,formData,
        {
          headers:{
        "Content-Type": "multipart/form-data"
      }
    }
    );
      const result = res.data;

      if (result.success === true) {
        console.log(result.data);
        set({ messages: [...messages, result.data] });
      } else {
        toast.error("Failed to send the message");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    } finally {
      set({ isMessageSending: false });
    }
  },
  subscribeToMessage:()=>{
    const {selectedUser}= get();
    if(!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage",(newMessage) =>{
      set({
        messages:[...get().messages,newMessage]
      })
    })
  },
  unsubscribeFromMessage:()=>{
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
