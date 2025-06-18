import { io } from 'socket.io-client';

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

function createPeer() {
  return new RTCPeerConnection({
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
      {
        urls: 'stun:global.stun.twilio.com:3478',
      },
    ],
  });
}

export let peer = createPeer();


export const createOffer = async () => {
  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);
  return offer;
};

export const createAnswer = async (offer) => {
  if (!offer || !offer.sdp || !offer.type) {
    console.error("Invalid offer:", offer);
    return;
  }

  await peer.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  return answer;
};

export const setRemoteAns = async (answer) => {
  if (!answer || !answer.sdp || !answer.type) {
    console.error("Invalid answer:", answer);
    return;
  }

  await peer.setRemoteDescription(new RTCSessionDescription(answer));
};


export const resetPeer = ()=>{
  peer = createPeer();
}


export default socket;
