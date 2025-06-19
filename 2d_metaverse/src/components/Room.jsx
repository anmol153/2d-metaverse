import { useCallback, useEffect, useRef, useState } from 'react';
import socket, { createOffer, createAnswer, setRemoteAns, peer, resetPeer } from '../socket';
import { useAuthStore } from '../store/useAuthStore';
import { PhoneOff, Volume2, VolumeOff } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';

const Room = () => {
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const { authUser } = useAuthStore();
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null); // ✅ changed from new MediaStream()
  const [isConnected, setIsConnected] = useState(false);
  const [muteFriend, setMuteFriend] = useState(true);
  const { endCall } = useChatStore();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        if (peer.signalingState === 'closed') {
          resetPeer();
        }
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

  const handleCallUser = useCallback(async () => {
    if (!remoteSocketId || !myStream) return;
    if (peer.signalingState === 'closed') {
      resetPeer();
    }
    const offer = await createOffer();
    socket.emit('call-user', {
      remoteSocketId,
      offer,
      username: authUser.username,
    });
    console.log('Calling user:', remoteSocketId);
  }, [remoteSocketId, myStream]);

  const handleEndCall = () => {
    peer.close();
    if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }
    setMyStream(null);
    setRemoteStream(null);
    setIsConnected(false);
    setRemoteSocketId(null);
    
    socket.emit('end-call', { to: remoteSocketId });
    endCall();
  };

  useEffect(() => {
    const onUserJoined = ({ username, id }) => {
      console.log('User joined:', username, id);
      setRemoteSocketId(id);
      handleCallUser();
    };

    socket.on('user:joined', onUserJoined);

    socket.on('incoming-call', async ({ offer, from, id }) => {
      console.log('Incoming call from:', from);
      const answer = await createAnswer(offer);
      socket.emit('call-accepted', { username: from, answer, id });
    });

    socket.on('call-accepted', async ({ answer }) => {
      await setRemoteAns(answer);
      setIsConnected(true);
    });

    socket.on('nego', async ({ offer, from }) => {
      const ans = await createAnswer(offer);
      socket.emit('nego_done', { to: from, ans });
    });

    socket.on('nego_final', async ({ ans }) => {
      await setRemoteAns(ans);
    });

    socket.on('end-call', () => {
      peer.close();
      if (myStream) myStream.getTracks().forEach(track => track.stop());
      if (remoteStream) remoteStream.getTracks().forEach(track => track.stop());
      setIsConnected(false);
      setRemoteSocketId(null);
      setMyStream(null);
      setRemoteStream(null);
      endCall();
    });

    socket.on('user:offline', (id) => {
      if (!remoteSocketId) return;
      if (id === remoteSocketId) handleCallUser();
    });

    return () => {
      socket.off('user:joined', onUserJoined);
      socket.off('incoming-call');
      socket.off('call-accepted');
      socket.off('nego');
      socket.off('nego_final');
      socket.off('end-call');
    };
  }, [handleCallUser]);

  const handleNegoNeeded = useCallback(async () => {
    const offer = await createOffer();
    socket.emit('nego', { offer, to: remoteSocketId });
  }, [remoteSocketId]);

  useEffect(() => {
    peer.addEventListener('negotiationneeded', handleNegoNeeded);
    return () => {
      peer.removeEventListener('negotiationneeded', handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  useEffect(() => {
    const trackHandler = (event) => {
      console.log('Received remote stream:', event.streams[0]);
      setRemoteStream(event.streams[0]); // ✅ important fix
    };

    peer.addEventListener('track', trackHandler);
    return () => {
      peer.removeEventListener('track', trackHandler);
    };
  }, []);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = muteFriend;
    }
  }, [muteFriend]);

  return (
    <div className="absolute left-1/3 top-2 z-[150] flex flex-row items-center gap-4 bg-transparent">
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="h-[150px] w-[250px] rounded-lg object-cover"
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="h-[150px] w-[250px] rounded-lg object-cover"
      />
      {remoteSocketId && !isConnected ? (
        <button
          onClick={handleCallUser}
          className="absolute top-0 left-80 btn btn-base z-100"
        >
          Call User
        </button>
      ) : null}
      {isConnected && (
        <>
          <button onClick={() => setMuteFriend(prev => !prev)}>
            {!muteFriend ? (
              <Volume2 className="size-5 absolute top-30 left-120" />
            ) : (
              <VolumeOff className="size-5 absolute top-30 left-120" />
            )}
          </button>
        </>
      )}
      <button onClick={handleEndCall}>
        <PhoneOff className="size-5 absolute top-29 left-55 text-red-500" />
      </button>
    </div>
  );
};

export default Room;
