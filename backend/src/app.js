import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";

import cors from "cors";
import userRoute from "./routes/usersRoute.js";

import { connectToSocket } from "./controllers/socketManager.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 3000);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoute);

const startServer = async () => {
  const connectionDb = await mongoose.connect(
    "mongodb+srv://shevaneprasad:12WPCwsznihIDQ9T@zoomclone.m03qx.mongodb.net/"
  );
  console.log(`MongoDB connected: ${connectionDb.connection.host}`);
  server.listen(5005, () => {
    console.log("Server is running on port 5000");
  });
};

startServer();
