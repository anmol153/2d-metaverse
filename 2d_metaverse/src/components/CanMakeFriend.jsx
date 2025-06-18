import React, { useEffect, useState } from 'react';
import socket from '../socket';
import { useChatStore } from '../store/useChatStore'; 
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';

const CanMakeFriend = () => {
  const [nearbyPlayers, setNearbyPlayers] = useState([]);
  const [sentRequests, setSentRequests] = useState({});
  const [loading, setLoading] = useState(null);
  const {authUser} = useAuthStore();
  const {
    getUser,
    user,
    addFriend,
    callOther,
    setRoom,
    room,
    setSelectedUser,
  } = useChatStore();

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    const handleProximity = (playerId) => {
      if (!playerId) return;
      setNearbyPlayers((prev) =>
        prev.includes(playerId) ? prev : [...prev, playerId]
      );
    };

    const handleNonProximity = (playerId) => {
      if (!playerId) return;
      setNearbyPlayers((prev) => prev.filter((id) => id !== playerId));
    };

    socket.on('showInteraction', handleProximity);
    socket.on('hideInteraction', handleNonProximity);

    return () => {
      socket.off('showInteraction', handleProximity);
      socket.off('hideInteraction', handleNonProximity);
    };
  }, []);

  const handleSendRequest = async (playerId) => {
    setLoading(playerId);
    await addFriend(playerId);
    await getUser();
    setSentRequests((prev) => ({ ...prev, [playerId]: true }));
    setLoading(null);
  };

  const isTheyFriend = (playerId) => {
    return user.some((u) => u.username === playerId);
  };
   const handleVideoChat = (e,playerId)=>{
    e.preventDefault();
    toast.success("request send");
    setRoom(authUser._id);
    setSelectedUser({username:playerId});
    callOther();
  };

  return (
    <div className="absolute top-20 left-10 p-4 w-72 bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Nearby Players
      </h2>
      {nearbyPlayers.length === 0 ? (
        <p className="text-gray-500 text-sm">No one nearby</p>
      ) : (
        <ul className="space-y-3">
          {nearbyPlayers.map((playerId) => (
            <li
              key={playerId}
              className="flex justify-between items-center bg-transparent rounded-xl px-3 py-2 hover:bg-slate-900/10 transition-all"
            >
              <span className="text-green-700 font-medium">{playerId}</span>
              {!isTheyFriend(playerId) ? (
                <button
                  onClick={() => handleSendRequest(playerId)}
                  disabled={sentRequests[playerId] || loading === playerId}
                  className={`text-sm px-3 py-1 rounded-full font-semibold ${
                    sentRequests[playerId]
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : loading === playerId
                      ? 'bg-blue-400 text-white animate-pulse'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {sentRequests[playerId]
                    ? 'Requested'
                    : loading === playerId
                    ? 'Sending...'
                    : 'Add Friend'}
                </button>
              ) : (
                <button onClick={(e)=>handleVideoChat(e,playerId)} className={`text-sm px-3 py-1 rounded-full font-semibold ${!room ? "bg-blue-600 text-white hover:bg-blue-700" : "'bg-blue-400 text-white animate-pulse'"}`}
                disabled = {room}>{!room ? "join" : "joined" }</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CanMakeFriend;
