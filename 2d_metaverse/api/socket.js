import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));


const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
//   transports: ['websocket'],
});

let userSocketMap = {}; 
export function getReceiverId(user){
    return userSocketMap[user];
}

let connectedUsers =[];

io.on('connection', (socket) => {
  socket.on('new-user connected', (playerId) => {
  console.log(`New user: ${playerId} (${socket.id})`);
  
  socket.emit('existing_users', connectedUsers);

  socket.broadcast.emit('new-user-connected', { id:playerId });

  connectedUsers.push({ id: playerId,socketId : socket.id });
})

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;
  io.emit("getOnlineUser", Object.keys(userSocketMap));

  socket.on('player-position', (data) => {
    console.log('Received player-position:', data);
    socket.broadcast.emit('player-position', data); 
  });
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    const disconnectedUser = connectedUsers.find((u) => u.socketId == socket.id);
    connectedUsers  = connectedUsers.filter((u) => u.socketId !== socket.id);
    socket.broadcast.emit('user-disconnected', { id:disconnectedUser.id });
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUser", Object.keys(userSocketMap));
    }
  });
});

export { io, server, app };