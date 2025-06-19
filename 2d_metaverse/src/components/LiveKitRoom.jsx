import React, { useEffect, useRef, useState } from 'react';
import { connect, RoomEvent, RemoteParticipant, createLocalVideoTrack, createLocalAudioTrack } from 'livekit-client';

const LiveKitRoom = ({ token, url }) => {
  const roomRef = useRef(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const connectToRoom = async () => {
      const room = await connect(url, token, {
        audio: true,
        video: true,
      });
      roomRef.current = room;

      room.on(RoomEvent.ParticipantConnected, participant => {
        console.log('Participant connected:', participant.identity);
      });

      room.on(RoomEvent.ParticipantDisconnected, participant => {
        console.log('Participant disconnected:', participant.identity);
      });

      setJoined(true);
    };

    connectToRoom();

    return () => {
      roomRef.current?.disconnect();
    };
  }, [token, url]);

  return (
    <div>
      {joined ? <h2>Connected to Room</h2> : <h2>Connecting...</h2>}
      <div id="video-container"></div>
    </div>
  );
};

export default LiveKitRoom;
