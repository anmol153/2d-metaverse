import toast from "react-hot-toast";
import { axiosToInstance } from "../lib/axios";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import socket from "../socket";

export const useChatStore = create((set, get) => ({
  messages: [],
  selectedUser: undefined,
  isUserLoading: false,
  isMessageLoading: false,
  isFriendLoading: false,
  isMessageSending: false,
  user: [],
  GroupMessage : [],
  groupChat :  false,
  personalRoom : null,
  canJoinVideo : false,
  room:false,
  videoChatRomm : null,
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
  deleteFriend: async (Friend) => {
    set({ isFriendLoading: true });
    try {
      const res = await axiosToInstance.post("/auth/removeFriend", { username: Friend });
      const result = res.data;
      if (result.success === true) {
        toast.success(`${Friend} is not your friend now`);
        get().getUser();
      } else {
        toast.error(result.message || "Failed to remove friend");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove friend");
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
    console.log(selectedUser);
    try {
      const res = await axiosToInstance.post(`/message/${selectedUser.username}`,formData,
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

    

    socket.on("newMessage",(newMessage) =>{
      set({
        messages:[...get().messages,newMessage]
      })
    })
  },
  unsubscribeFromMessage:()=>{
    socket.off("newMessage");
  },
  setSelectedUser: (user) => set({ selectedUser: user }),


  sendGroupMessage : (userId,message)  => {
    socket.emit("group-message",{message});
  },
  getGroupMessage : () =>{
    socket.off("load-group-messages");
    const {GroupMessage} = get();
    socket.on("load-group-messages",(groupMessages)=>
      {
        set({GroupMessage:groupMessages});
        console.log(groupMessages);
  })
  },
  getGroup: () => {
  socket.off("group-message");
  socket.on("group-message", (msg) => {
    set({
      GroupMessage: [...get().GroupMessage, msg]
    });
  });
},
GroupChatOn: ()=>{
  const {groupChat} = get();
  set({groupChat:!groupChat});
},
setRoom : (room) =>{
  const {personalRoom} = get();
  set({personalRoom:room});
},
callOther : () => {
  const authUser = useAuthStore.getState().authUser;
  const { selectedUser, personalRoom} = get();
  socket.emit("join_peer", { from: authUser.username, to: selectedUser.username, room: personalRoom });


  socket.on("call_accepted", ({ from }) => {
    toast.success(`Call accepted by ${from}`);
     set({canJoinVideo:true});
  });

  socket.on("call_rejected", ({ from }) => {
    set({personalRoom:null});
    toast.error(`Call rejected by ${from}`);
  });
},
getCall: () => {
  socket.off("join_peer");
  socket.on("join_peer", ({ from, room }) => {
    const accepted = window.confirm(`Incoming video call from ${from}. Do you want to accept the call?`);
    if (accepted) {
      get().acceptCall(from, room);
    } else {
      get().rejectCall(from, room);
    }
  });
},
acceptCall: (from, room) => {
  const { authUser } = useAuthStore.getState(); 
  set({ personalRoom: room });
  set({canJoinVideo:true});
  socket.emit("accept_call", { to: from, from: authUser.username});
},
rejectCall: (from, room) => {
  const { authUser } = useAuthStore.getState(); 
  socket.emit("reject_call", { to: from, from: authUser.username });
},
nowJoin : () =>{
  set({canJoinVideo:false});
  set({room:true});
},
endCall : () =>{
  set({canJoinVideo:null});
  set({room:false});
  set({personalRoom:null});
},
setVideoChat :(room)=>{set({videoChatRomm:room})},
endVideoCall :()=>{set({videoChatRomm:null})},
}));
