import { useEffect, useRef, useState } from 'react';
import {
  Room,
  Track,
  createLocalTracks,
  LocalVideoTrack,
  LocalAudioTrack,
} from 'livekit-client';
import { axiosToInstance } from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';

const Room1 = () => {
  const [room, setRoom] = useState(null);
  const [connected, setConnected] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const { authUser } = useAuthStore();

  const createFallbackVideoTrack = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('No Camera Available', 150, 240);

    // Continuously draw to simulate video
    setInterval(() => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.fillText('No Camera Available', 150, 240);
    }, 1000 / 30); // 30 fps

    const stream = canvas.captureStream(30); // 30 fps
    const track = stream.getVideoTracks()[0];
    return new LocalVideoTrack(track);
  };

  const joinRoom = async () => {
    const roomName = 'my-room';
    const userName = authUser.username;

    try {
      const res = await axiosToInstance.get(`/live/get-token?room=${roomName}&name=${userName}`);
      const token = res.data.token;
      const newRoom = new Room();
      setRoom(newRoom);

      newRoom.on('participantConnected', (participant) => {
        participant.on('trackSubscribed', (track) => {
            console.log(track);
          if (track.kind === Track.Kind.Video && remoteVideoRef.current) {
            const element = track.attach();
            remoteVideoRef.current.innerHTML = '';
            remoteVideoRef.current.appendChild(element);
          } else if (track.kind === Track.Kind.Audio) {
            const element = track.attach();
            document.body.appendChild(element);
          }
        });
      });

      newRoom.on('trackSubscribed', (track) => {
        if (track.kind === Track.Kind.Video && remoteVideoRef.current) {
          const element = track.attach();
          remoteVideoRef.current.innerHTML = '';
          remoteVideoRef.current.appendChild(element);
        } else if (track.kind === Track.Kind.Audio) {
          const element = track.attach();
          document.body.appendChild(element);
        }
      });

      await newRoom.connect('ws://localhost:7880', token);
      setConnected(true);

    let localTracks;
        try {
        localTracks = await (createLocalTracks({
  video: {
    width: 640,
    height: 480,
    frameRate: 30,
  },
  audio: true,
}));
        } catch (err) {
        console.warn('⚠️ Camera or mic not available. Using fallback video.');
        const fallbackVideo = createFallbackVideoTrack();
        localTracks = [fallbackVideo];
        }


      for (const track of localTracks) {
        await newRoom.localParticipant.publishTrack(track);
        if (track.kind === Track.Kind.Video && localVideoRef.current) {
          const element = track.attach();
          localVideoRef.current.innerHTML = '';
          localVideoRef.current.appendChild(element);
        }
      }
    } catch (err) {
      console.error('❌ Could not join room:', err);
    }
  };

  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
        console.log('🛑 Disconnected from LiveKit');
      }
    };
  }, [room]);

  return (
    <div className="text-white p-4">
      {!connected ? (
        <button
          onClick={joinRoom}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          Join LiveKit Room
        </button>
      ) : (
        <div>
          <p className="text-green-400">✅ Connected as <b>{authUser.username}</b></p>
          <div className="flex flex-col md:flex-row mt-4 space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/2">
              <h3 className="text-lg mb-2">🎥 Local Video</h3>
              <div ref={localVideoRef} className="bg-black rounded overflow-hidden h-64" />
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-lg mb-2">🌍 Remote Video</h3>
              <div ref={remoteVideoRef} className="bg-black rounded overflow-hidden h-64" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room1;
