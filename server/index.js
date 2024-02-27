import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
const app = express();
const server = new createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["POST", "GET"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join-room", (id) => {
    socket.join(id);
  });
  socket.on("send-message", (message) => {
    switch (message.radioBtn) {
      case "broadcast":
        socket.broadcast.emit("receive-message", {
          message,
          id: socket.id,
        });
      case "oneToOne":
        socket.to(message.personId).emit("receive-message", {
          message,
          id: socket.id,
        });
      case "room":
        socket.to(message.roomid).emit("receive-message", {
          message,
          id: socket.id,
        });
    }
  });
});

server.listen(8082, () => {
  console.log("server is listening");
});
