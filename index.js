import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());

const server = createServer(app);
server.listen(PORT, () => {
  console.log(`Listening server at ${PORT}`);
});

app.get("/", (_req, res) => {
  return res.send("Working");
});

const io = new Server(server, {
  cors: { origin: true },
});

io.on("connection", (socket) => {
  console.log(`$${socket.id} connected`);
  socket.on("join_room", async (roomId) => {
    console.log(`Room ${roomId} joined by user ${socket.id}`);
    await socket.join(roomId);
  });

  socket.on("message", (data) => {
    console.log(data.roomID);
    socket.to(data.roomID).emit("receive", data);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

export default server;
