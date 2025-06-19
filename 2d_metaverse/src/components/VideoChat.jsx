import React, { useCallback, useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Outlet, useNavigate } from 'react-router';
import socket from '../socket';
import { useChatStore } from '../store/useChatStore';
const VideoChat = () => {
    const {authUser} = useAuthStore();
    const navigate  = useNavigate();
    const {personalRoom,nowJoin}  = useChatStore();

    const handleSubmit = (e)=>{
        e.preventDefault();
        socket.emit("join room", {username:authUser.username,room:personalRoom});
    }

    const handleJoin = useCallback(()=>{
        nowJoin();
    });

    useEffect(()=>{
        socket.on("Joined",(data) =>handleJoin(data));

        return  ()=>{socket.off("Joined")};
    },[socket]);
  return (
    <>
    <div className=' bg-slate-700 absolute top-0.5 left-200 rounded-lg z-400'>
        <form onSubmit={handleSubmit}>
            <button className='btn btn-success ' >Join</button>
        </form>
    </div>
    </>
  )
}

export default VideoChat;