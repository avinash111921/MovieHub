import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import axios from "axios";

dotenv.config({
    path : "./.env",
})
const app = express();

// CORS configuration - must be before any routes
app.use(cors({
    origin: true, // Allow requests from any origin during development
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
import {upcomingMovieRouter} from "./routes/upcomingMovie.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/movies", upcomingMovieRouter);

export {app};
