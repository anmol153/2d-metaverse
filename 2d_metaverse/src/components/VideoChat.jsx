import React, { useCallback, useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Outlet, useNavigate } from 'react-router';
import socket from '../socket';
const VideoChat = () => {
    const {authUser} = useAuthStore();
    const navigate  = useNavigate();
    useEffect(()=>{
        socket.connect();
        socket.emit("connected",{userId:authUser.username});
    },[]);


    const handleSubmit = (e)=>{
        e.preventDefault();
        socket.emit("join room", {username:authUser.username,room:1});
    }

    const handleJoin = useCallback(({room})=>{
        navigate(`/room/${room}`);
    });

    useEffect(()=>{
        socket.on("Joined",(data) =>handleJoin(data));

        return  ()=>{socket.off("Joined")};
    },[socket]);
  return (
    <>
    <div className='pt-20 bg-slate-700'>
        <form onSubmit={handleSubmit}>
            <button className='btn btn-lg ' >Join</button>
        </form>
    </div>
    </>
  )
}

export default VideoChat