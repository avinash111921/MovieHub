import dotenv from "dotenv";
import connectDB from "./src/db/index.js"
import {server} from "./src/lib/socket.js"
import cors from "cors"

dotenv.config({
    path : "./.env",
})

const PORT = process.env.PORT || 5001;

//IFFE 
;(async () => {
    try{
        await connectDB();
        
        // Apply CORS middleware to the server
        server.use(cors({
            origin: ['https://moviehub-frontend.onrender.com', 'http://localhost:5173'],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
            exposedHeaders: ['Content-Range', 'X-Content-Range'],
            optionsSuccessStatus: 204
        }));

        server.listen(PORT,()=> {
            console.log(`⚙️  Server is running at http://localhost:${PORT}`);
            console.log(`🔌 Socket.IO server is ready`);
        });
    }
    catch(error){
        console.log("Error connecting to the database", error.message);
        process.exit(1);
    }
})();