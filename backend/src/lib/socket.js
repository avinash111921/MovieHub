import { Server } from "socket.io"
import http from "http"
import {app} from "../app.js"

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    },
});

const userSocketMap = {};  /* {userId : socketId} */ 
/* Allow server to efficently manage real time communication by tracking which user are conncected and which socket belong to them */

function getReciverScoketID(userId) {
    return userSocketMap[userId];
}

io.on("connection",(socket) => {
    console.log("A user connected",socket.id);
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id
    }
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect",() =>{
        if (userId) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
        console.log("A user disconnected", socket.id);
    })
})
export {app, io,server,getReciverScoketID};