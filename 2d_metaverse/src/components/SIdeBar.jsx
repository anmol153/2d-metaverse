import { Users } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import SidebarSkeleton from './SideBarSkleton';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
const SideBar = () => {
    const {getUser,user,selectedUser,isUserLoading,setSelectedUser,addFriend,deleteFriend}   = useChatStore();
    
    const {onlineUser} =  useAuthStore();
    const [showOnlineOnly,setShowOnlineOnly] = useState(false);
    const [Friend,setFriend] = useState("");
    const [UnFriend,setUnFriend] = useState("");
    console.log(onlineUser);
    console.log(user);
    useEffect(()=>{
        getUser();
    },[getUser]);
    
    const filteredUsers = showOnlineOnly
    ? user.filter((user) => onlineUser.includes(user.username))
    : user;
    const handleSubmit = (e)=>{
        e.preventDefault();
        if(Friend.trim() ==0) return toast.error("Please Enter the username");
        addFriend(Friend);
    }
    const deleteSubmit = (e)=>{
        e.preventDefault();
        if(UnFriend.trim() ==0) return toast.error("Please Enter the username");
        deleteFriend(UnFriend);
    }
    if(isUserLoading) return <SidebarSkeleton/>
   return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUser.length-1} online)</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2 lg:flex-col">
        <form onSubmit={(e)=>handleSubmit(e)}>
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="text"
              valuse={Friend}
              placeholder='Username'
              onChange={(e)=>setFriend(e.target.value)}
              className="btn btn-sm gap-2 transition-colors rounded-lg"
            />
          <button className='btn btn-sm rounded-lg'>ADD</button>
          </label>
          </form>
        <form onSubmit={(e)=>deleteSubmit(e)}>
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="text"
              valuse={UnFriend}
              placeholder='Username'
              onChange={(e)=>setUnFriend(e.target.value)}
              className="btn btn-sm gap-2 transition-colors rounded-lg"
            />
          <button className='btn btn-sm rounded-lg bg-red-400 text-slate-900'>Remove</button>
          </label>
          </form>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.avatar}
                alt={user.username}
                className="size-12 object-cover rounded-full"
              />
              {onlineUser.includes(user.username) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullname} </div>
              <div className="text-sm text-zinc-400">
                {onlineUser.includes(user.username) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default SideBar;