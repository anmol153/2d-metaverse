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
const groupMessages = [];
export function getReceiverId(userId) {
  return userSocketMap[userId];
}

io.on('connection', (socket) => {

  socket.on("connected", ({userId})=>{


  socket.join('global-room');
  socket.emit("load-group-messages", groupMessages);

  if (userId) {
    console.log("user connected");
    if(!userSocketMap[userId]) userSocketMap[userId] = socket.id;
    console.log(`New user: ${userId} (${socket.id})`);

    socket.broadcast.emit('new-user-connected', { id1: userId });

    io.emit("getOnlineUser", Object.keys(userSocketMap));
    io.emit('existing_users', Object.keys(userSocketMap));
  }
});

  socket.on('player-position', (data) => {
    socket.broadcast.emit('player-position', data);
  });


  socket.on("proximity", ({ player1, player2 }) => {
  const socketId1 = getReceiverId(player1);
  const socketId2 = getReceiverId(player2);
  if (socketId1) io.to(socketId1).emit("showInteraction", player2);
  if (socketId2) io.to(socketId2).emit("showInteraction", player1);
  });


  socket.on("non_proximity", ({ player1, player2 }) => {
  const socketId1 = getReceiverId(player1);
  const socketId2 = getReceiverId(player2);

  if (socketId1) setTimeout(()=>{io.to(socketId1).emit("hideInteraction", player2)},3000);
  if (socketId2) setTimeout(()=>{io.to(socketId2).emit("hideInteraction", player1)},3000);
  });

  socket.on("group-message", ({message }) => {
  groupMessages.push(message);
  io.emit("group-message", message);
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
    if (Object.keys(userSocketMap).length === 0) {
    groupMessages.length = 0;
    console.log("All users disconnected — chat buffer cleared.");
  }
  });
});

export { io, server, app };