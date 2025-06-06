import http from 'http'
import express from 'express'
import path from 'path'
import { Server } from "socket.io";
import cors from 'cors'
const app = express();
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
    origin: '*',
  },
  transports: ['websocket'], // important: force websocket
});


io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on('player-position', (data) => {
    console.log('Received player-position from', socket.id, data);

    // Broadcast to other clients (not the sender)
    socket.broadcast.emit('player-position', data);
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
  });
});


server.listen(4000, ()=>console.log('server is  connected at 4000'));