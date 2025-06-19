import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  Room,
  Track,
  createLocalTracks,
  LocalVideoTrack,
  ConnectionState,
} from 'livekit-client';
import { axiosToInstance } from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';

const RoomView = () => {
  const { name } = useParams();
  const { authUser } = useAuthStore();
  const [room, setRoom] = useState(null);
  const [connected, setConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  const localVideoRef = useRef(null);

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
    setInterval(() => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.fillText('No Camera Available', 150, 240);
    }, 1000 / 30);
    const stream = canvas.captureStream(30);
    return new LocalVideoTrack(stream.getVideoTracks()[0]);
  };

  const attachTrack = (track, participant) => {
    if (track.kind === Track.Kind.Video) {
      const el = track.attach();
      el.autoplay = true;
      el.playsInline = true;

      const tryAttach = () => {
        const container = document.getElementById(`remote-${participant.identity}`);
        if (container) {
          container.innerHTML = '';
          container.appendChild(el);
        } else {
          setTimeout(tryAttach, 100);
        }
      };
      tryAttach();
    } else if (track.kind === Track.Kind.Audio) {
      const el = track.attach();
      document.body.appendChild(el);
    }
  };

  const joinRoom = async () => {
    if (room && room.connectionState === ConnectionState.Connected) return;

    try {
      const tokenRes = await axiosToInstance.get(
        `/live/get-token?room=${name}&name=${authUser.username}`
      );
      const token = tokenRes.data.token;

      const newRoom = new Room();
      setRoom(newRoom);

      newRoom.on('connectionStateChanged', async (state) => {
        if (state === 'connected') {
          setConnected(true);
          console.log(newRoom.remoteParticipants);
          for (const participant of newRoom.remoteParticipants.values()) {
                setParticipants((prev) => [...prev, participant]);

                participant.on('trackSubscribed', (track) => {
                  attachTrack(track, participant);
                });
              }

          let localTracks;
          try {
            localTracks = await createLocalTracks({
              video: { width: 640, height: 480, frameRate: 30 },
              audio: true,
            });
          } catch (err) {
            localTracks = [createFallbackVideoTrack()];
          }

          for (const track of localTracks) {
            await newRoom.localParticipant.publishTrack(track);

            if (track.kind === Track.Kind.Video && localVideoRef.current) {
              const el = track.attach();
              el.muted = true;
              el.autoplay = true;
              el.playsInline = true;
              localVideoRef.current.innerHTML = '';
              localVideoRef.current.appendChild(el);
              await el.play().catch(console.warn);
            }
          }
        }
      });

      // Handle future participants
      newRoom.on('participantConnected', (participant) => {
        setParticipants((prev) => [...prev, participant]);

        participant.on('trackSubscribed', (track) => {
          attachTrack(track, participant);
        });
      });


      newRoom.on('participantDisconnected', (participant) => {
        setParticipants((prev) =>
          prev.filter((p) => p.identity !== participant.identity)
        );
      });

      await newRoom.connect('ws://localhost:7880', token);

      // Process existing participants
       newRoom.on('connected', (participant) => {
        console.log("existing");
        setParticipants((prev) => [...prev, participant]);

        participant.on('trackSubscribed', (track) => {
          attachTrack(track, participant);
        });
      });

        // Try to attach already subscribed tracks
    } catch (err) {
      console.error('❌ Could not join room:', err);
    }
  };

  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
        room.removeAllListeners();
      }
      setRoom(null);
      setParticipants([]);
    };
  }, []);

  return (
    <div className="p-4 text-white">
      {!connected ? (
        <button
          onClick={joinRoom}
          className="bg-blue-500 px-4 py-10 rounded"
        >
          Join Room
        </button>
      ) : (
        <>
          <h2 className="text-green-400 text-xl">Room: <b>{name}</b></h2>
          <h3 className="text-sm text-gray-400">Connected as: {authUser.username}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <h4 className="mb-2">🎥 Your Camera</h4>
              <div ref={localVideoRef} className="h-64 bg-black rounded" />
            </div>

            <div>
              <h4 className="mb-2">👥 Other Participants</h4>
              <div className="grid grid-cols-2 gap-2">
                {participants.map((p) => (
                  <div
                    key={p.identity}
                    id={`remote-${p.identity}`}
                    className="bg-black rounded h-32"
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoomView;
