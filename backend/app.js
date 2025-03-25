import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"

dotenv.config({
    path : "./.env",
})
const app = express();

app.use(
    cors({
        origin : process.env.CORS_ORIGIN,
        credentials : true,
    })
)

//common middleware

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public")) //assests ke liye
app.use(cookieParser());

//routes
import {userRouter} from "./routes/user.routes.js";

app.use("/api/v1/users",userRouter);

export {app}