// server/index.js

require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors()); // allow cross-origin requests

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // You can limit this to your frontend URL in production
    methods: ["GET", "POST"],
  },
});

// When a client connects
io.on("connection", (socket) => {
  // console.log("User connected:", socket.id);

  // Join room based on userId (senderId or receiverId)
  socket.on("join", ({ userId }) => {
    if (userId) {
      socket.join(userId);
      // console.log(`Socket ${socket.id} joined room: ${userId}`);
    }
  });

  // Listen for messages from clients
  socket.on("sendMessage", ({ to, message }) => {
    if (to && message) {
      // Emit the message to the 'to' user room only
      io.to(to).emit("newMessage", message);
      // console.log(`Message from ${message.sender} sent to ${to}:`, message);
    }
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT;
// console.log("consoling the port" , PORT);
server.listen(PORT, () => {
   console.log(`Socket.IO server listening on port ${PORT}`);
});
