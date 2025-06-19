import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLocalVideoTrack } from 'livekit-client';
import { axiosToInstance } from '../lib/axios';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [previewTrack, setPreviewTrack] = useState(null);
  const previewRef = useRef(null);
  const navigate = useNavigate();

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

  const showVideoPreview = async () => {
    const track = await createLocalVideoTrack();
    setPreviewTrack(track);
    const element = track.attach();
    previewRef.current.innerHTML = '';
    previewRef.current.appendChild(element);
  };

  const joinRoom = (roomName) => {
    navigate(`/room/${roomName}`);
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl mb-4">Available Rooms</h2>
      <button onClick={createRoom} className="bg-green-500 px-4 py-2 rounded mb-4">
        Create New Room
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.name}
            className="bg-gray-800 rounded p-4 cursor-pointer hover:bg-gray-700"
            onClick={() => joinRoom(room.name)}
          >
            <h3 className="text-lg font-bold">{room.name}</h3>
            <p>{room.numParticipants} participants</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg mb-2">Video Preview</h3>
        <button onClick={showVideoPreview} className="bg-blue-500 px-4 py-2 rounded">
          Show Preview
        </button>
        <div ref={previewRef} className="mt-4 w-64 h-48 bg-black rounded" />
      </div>
    </div>
  );
};

export default RoomList;
