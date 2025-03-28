import dotenv from "dotenv";
import connectDB from "./src/db/index.js"
import {server} from "./src/lib/socket.js"

dotenv.config({
    path : "./.env",
})

const PORT = process.env.PORT || 5001;

//IFFE 
;(async () => {
    try{
        await connectDB();
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