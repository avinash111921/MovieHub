import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js'
import connectCLoudinary from './config/mongodb.js'
import userRouter from './routes/userRoute.js'
//app configuration
const app = express();
const port = process.env.PORT || 4000
connectDB()
connectCLoudinary();

//middleware
app.use(cors(
    {origin:`${process.env.URL}`,
    credentials:true}
));
app.use(express.json());

//api endpoint 
app.use('/api/user',userRouter)

app.get('/',(req,res)=>{
    res.send("API WORKING")
})

app.listen(port,()=> console.log('server listening on port :'+port));