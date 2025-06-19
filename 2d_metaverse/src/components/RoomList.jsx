import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLocalVideoTrack } from 'livekit-client';
import { axiosToInstance } from '../lib/axios';
import { useChatStore } from '../store/useChatStore';
import toast from 'react-hot-toast';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [previewTrack, setPreviewTrack] = useState(null);
  const previewRef = useRef(null);
  const navigate = useNavigate();
  const {videoChatRomm,setVideoChat,personalRoom} = useChatStore();
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await axiosToInstance.get('/live/rooms');
    const data = res.data;
    setRooms(data.rooms);
  };

  const createRoom = async () => {
    const roomName = prompt("Enter room name");
    if (roomName) {
      await axiosToInstance.get(`/live/create-room?name=${roomName}`);
      fetchRooms();
    }
  };


  const joinRoom = (roomName) => {
    if(videoChatRomm) return toast.error(`🚪 Hold on! You're already chilling in ${videoChatRomm}`);
    if(personalRoom) return toast.error(`🚪 Hold on! You're already chilling `);
    setVideoChat(roomName);
  };

  return (
    <div className="p-6  absolute flex flex-col top-30 right-5 bg-base-100 opacity-95 rounded-lg z-1000">
      <h2 className="text-2xl mb-4">Available Rooms</h2>
      <button onClick={createRoom} className="bg-accent px-4 py-2 rounded mb-4">
        Create New Room
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.length !=0 ? rooms.map((room) => (
          <div
            key={room.name}
            className=" rounded p-4 cursor-pointer bg-base-300"
            onClick={() => joinRoom(room.name)}
          >
            <h3 className="text-lg font-bold">{room.name}</h3>
            <p>{room.numParticipants} participants</p>
          </div>
        )) : <h1>No Room </h1>}
      </div>
    </div>
  );
};

export default RoomList;
