import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"

dotenv.config({
    path : "./.env",
})
const app = express();

// CORS configuration - must be before any routes
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    optionsSuccessStatus: 204
}));

// Common middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import {userRouter} from "./routes/user.routes.js";
import {messageRouter} from "./routes/message.routes.js"

app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messageRouter);

export {app};