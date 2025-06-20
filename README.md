# 🌐 2D Metaverse - Real-Time Multiplayer World

A feature-rich **2D multiplayer metaverse** built with **React, Canvas, Socket.IO, WebRTC**, and **LiveKit**. Explore, chat, call, and interact in real-time — all from your browser.


---

## 🚀 Features

### 🧍 Real-Time Multiplayer

- 2D character movement with HTML5 Canvas
- Smooth, synced animations and velocity
- Player usernames rendered above avatars
- Boundary collision support

### 🧠 Proximity Interaction

- Proximity detection between players
- Triggers chat and call UI when close

### 💬 Text Chat

- ✅ 1-to-1 personal chat via **Socket.IO**
- ✅ Group chat via **Socket.IO rooms**
- ✅ Image/photo sharing in chat
- ✅ Message history saved in **MongoDB**
- Message UI with timestamps and profile images

### 📞 Video Calling

- ✅ **Personal video call** using **WebRTC + Socket.IO**
- ✅ **Group video call** powered by **LiveKit (SFU)**
- Toggle mic/camera, end call, and room join/leave

### 👤 User Profiles

- JWT-based authentication
- ✅ Upload personal **profile photo**
- Profile shown in chat and video calls

### 🗃️ Backend

- Built with **Express.js** + **MongoDB**
- Stores users, messages, and profile info
- Image uploads via **Multer** (or Cloudinary optional)

---

## 🛠️ Tech Stack

| Layer        | Technology               |
|--------------|---------------------------|
| Frontend     | React, Vite, Tailwind CSS |
| Canvas       | HTML5 Canvas API          |
| State Mgmt   | Zustand                   |
| Real-time    | Socket.IO                 |
| Video (1-1)  | WebRTC                    |
| Video (Group)| LiveKit SFU               |
| Backend      | Express.js, MongoDB       |
| File Upload  | Multer or Cloudinary      |
| Auth         | JWT or session-based      |

---
