import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server } from "socket.io";
import LeaderboardModel from "./models/leaderboard.js";
import gameRoutes from "./routes/game.js";
import leaderboardRoutes from "./routes/leaderboard.js";
const io = new Server(server);
app.use(cors());
const port = 5000;
// Register routes as middleware
app.use('/game', gameRoutes);
app.use('/leaderboard', leaderboardRoutes);
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
mongoose
    .connect(process.env.DB_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log("MongoDB connected");
})
    .catch((error) => {
    console.log(error);
});
io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("endGame", async ({ username }) => {
        try {
            const leaderboard = await LeaderboardModel.find()
                .sort({ score: -1 })
                .limit(10)
                .lean();
            io.emit("leaderboard", { leaderboard });
        }
        catch (error) {
            console.log(error);
        }
    });
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});
//# sourceMappingURL=index.js.map