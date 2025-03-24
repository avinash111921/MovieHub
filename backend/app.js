import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin : process.env.CORS_ORIGIN,
        credentials : true,
    })
)

//common middleware

app.use(express.json({limit : "20kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public")) //assests ke liye
app.use(cookieParser());

//routes
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users",userRouter);

export {app}