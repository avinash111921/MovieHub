import { Server } from "socket.io"
import http from "http"
import express from "express" // Import express

const app = express(); // Initialize app before using it

const server = http.createServer(app)
const io = new Server(server);  //if not work pass cors : origin 

function getReciverScoketID(userId) {
    return userSocketMap[userId];
}

const userSocketMap = {} /* {userId : socketId} */ 
/* Allow server to efficently manage real time communication by tracking which user are conncected and which socket belong to them */

io.on("connection",(socket) => {
    console.log("A user connected",socket.id);
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id
    }
    io.emit("getOnlineUser",Object.keys(userSocketMap));

    socket.on("disconnect",() =>{
        console.log("A user disconnected",socket.id);
        if(userId) delete userSocketMap[userId];
        io.emit("getOnlineUser",Object.keys(userSocketMap));
    })
})
export {io,server,getReciverScoketID};