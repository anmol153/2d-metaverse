import { VideoIcon, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser,setRoom,personalRoom,callOther,videoChatRomm} = useChatStore();
  const { onlineUser,authUser } = useAuthStore();

  const handleVideoChat = (e)=>{
    e.preventDefault();
    if(videoChatRomm) return toast.error(`🚪 Hold on! You're already chilling in ${videoChatRomm}`)
    toast.success("request send");
    setRoom(authUser._id);
    callOther();
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.avatar} alt={selectedUser.fullname} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullname} ({selectedUser.username})</h3>
            <p className="text-sm text-base-content/70">
              {onlineUser.includes(selectedUser.username) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex flex-row  justify-end gap-7">
        {onlineUser.includes(selectedUser.username) && 
        ( 

          <form onSubmit={handleVideoChat}>
            <button disabled={personalRoom}><VideoIcon className="ml-30"/></button>
          </form>
        )}
        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;