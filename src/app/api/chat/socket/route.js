import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import chatModel from "@/models/chatModel";
import connectDB from "@/lib/db";

let io;

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // { id, role }
  } catch (err) {
    return null;
  }
};

export default async function handler(req, res) {
  if (!res.socket.server.io) {
    // console.log("Initializing Socket.io...");
    io = new Server(res.socket.server, {
      path: "/api/chat/socket",
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    await connectDB();

    io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      const user = verifyToken(token);
      if (!user) return next(new Error("Authentication failed"));
      socket.user = user;
      next();
    });

    io.on("connection", (socket) => {
      // console.log("User connected:", socket.user.id);

      // Join a personal room
      socket.join(socket.user.id);

      // Receive & forward message
      socket.on("sendMessage", async ({ to, message }) => {
        const newMsg = await chatModel.create({
          senderId: socket.user.id,
          receiverId: to,
          message,
        });

        // Emit to recipient and sender
        io.to(to).emit("newMessage", newMsg);
        io.to(socket.user.id).emit("newMessage", newMsg);
      });

      socket.on("disconnect", () => {
        // console.log("User disconnected:", socket.user.id);
      });
    });
  }

  res.end();
}
