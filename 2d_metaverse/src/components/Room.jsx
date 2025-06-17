import { useCallback, useEffect, useRef, useState } from 'react';
import socket, { createOffer, createAnswer, setRemoteAns, peer } from '../socket';
import { useAuthStore } from '../store/useAuthStore';

const Room = () => {
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const { authUser } = useAuthStore();
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(new MediaStream());
  const [isConnected, setIsConnected] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setMyStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach(track => {
          peer.addTrack(track, stream);
        });
      } catch (err) {
        console.error('Error accessing user media:', err);
      }
    })();
  }, []);

  
  useEffect(() => {
    socket.on('user:joined', ({ username, id }) => {
      console.log('User joined:', username, id);
      setRemoteSocketId(id);
    });

    socket.on('incoming-call', async ({ offer, from, id }) => {
      console.log('Incoming call from:', from);
      const answer = await createAnswer(offer);
      socket.emit('call-accepted', { username: from, answer, id });
    });

    socket.on('call-accepted', async ({ answer }) => {
      await setRemoteAns(answer);
      setIsConnected(true);
    });

    socket.on('nego',async ({offer,from})=>{
      const ans  = peer.createAnswer(offer);
      socket.emit("nego_done",{to:from,ans});
    })

    socket.on('nego_final',async({ans})=>{
        setRemoteAns(ans);
    })

    return () => {
      socket.off('user:joined');
      socket.off('incoming-call');
      socket.off('call-accepted');
      socket.off('nego');
      socket.off('nego_final');
    };
  }, []);

  const handleNegoNeeded = useCallback(async ()=>{
    const offer = await createOffer();
    socket.emit('nego' , {offer,to:remoteSocketId});
  },[]);


  useEffect (()=>{
    peer.addEventListener('negotiationneeded', handleNegoNeeded);
    return ()=>{ peer.removeEventListener('negotiationneeded')};
  },[handleNegoNeeded]);


  
  useEffect(() => {
    peer.addEventListener('track', async (event) => {
      console.log('Received remote stream:', event.streams[0]);
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
    });

  }, [remoteStream]);

 
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleCallUser = async () => {
    if (!remoteSocketId || !myStream) return;
    const offer = await createOffer();
    socket.emit('call-user', {
      remoteSocketId,
      offer,
      username: authUser.username,
    });
    console.log('Calling user:', remoteSocketId);
  };

  return (
    <div className="text-center pt-20 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">WebRTC Room</h1>

      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="w-[400px] h-[300px] bg-black rounded-md"
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-[400px] h-[300px] bg-black rounded-md"
      />

      {remoteSocketId ? (
        <button
          onClick={handleCallUser}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Call User
        </button>
      ) : (
        <div>No one in the room</div>
      )}

      {isConnected && (
        <div className="text-green-600 text-lg font-semibold">✅ Connected</div>
      )}
    </div>
  );
};

export default Room;
