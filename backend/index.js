import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";
import ACTIONS from "../frontend/src/action.js";
import AuthRoutes from "./route/auth.route.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configure CORS
const corsOptions = {
  origin: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static("public"));

// Serve static files from the React frontend app
app.use(express.static(join(__dirname, '../frontend/build')));

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/build', 'index.html'));
});

const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("Socket Connected ", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    const existingSocketId = Object.keys(userSocketMap).find(
      (socketId) => userSocketMap[socketId] === username
    );

    if (existingSocketId) {
      socket.emit("duplicate_connection", { message: "Duplicate connection detected." });
      return;
    }

    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.UPDATE_GAME, ({ roomId, data }) => {
    socket.to(roomId).emit(ACTIONS.GAME_UPDATED, { data });
  });

  socket.on(ACTIONS.UPDATE_SCORE, ({ roomId, player1Score, player2Score }) => {
    socket.to(roomId).emit(ACTIONS.SCORE_UPDATED, { player1Score, player2Score });
  });

  socket.on(ACTIONS.CHANGE_PLAYER, ({ roomId, data }) => {
    socket.to(roomId).emit(ACTIONS.PLAYER_CHANGED, { data });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

app.use("/GamingZone/auth", AuthRoutes);

const PORT = process.env.PORT || 12000;
const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      dbName: "Home-Hive",
      retryWrites: true,
      w: 'majority',
    });

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log("Connected to MongoDB");
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

main();
