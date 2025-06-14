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
});

let userSocketMap = {};

export function getReceiverId(userId) {
  return userSocketMap[userId];
}

io.on('connection', (socket) => {

  socket.on("connected", ({userId})=>{
  if (userId) {
    console.log("user connected");
    userSocketMap[userId] = socket.id;
    console.log(`New user: ${userId} (${socket.id})`);

    socket.broadcast.emit('new-user-connected', { id: userId });

    io.emit("getOnlineUser", Object.keys(userSocketMap));
    io.emit('existing_users', Object.keys(userSocketMap));
  }
});

  socket.on('player-position', (data) => {
    socket.broadcast.emit('player-position', data);
  });

  socket.on('disconnection', (userId) => {
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      socket.broadcast.emit('user-disconnected', { id: userId });
      io.emit("getOnlineUser", Object.keys(userSocketMap));
    }
  });

  socket.on('disconnect', () => {
    const disconnectedUserId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );
    if (disconnectedUserId) {
      delete userSocketMap[disconnectedUserId];
      socket.broadcast.emit('user-disconnected', { id: disconnectedUserId });
      io.emit("getOnlineUser", Object.keys(userSocketMap));
      console.log(`User disconnected: ${disconnectedUserId}`);
    }
  });
});

export { io, server, app };