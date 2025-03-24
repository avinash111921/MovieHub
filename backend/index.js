import dotenv from "dotenv";
import connectDB from "./db/index.js";


dotenv.config({
    path : "./.env",
})

const PORT = process.env.PORT || 4000;

//IFFE 
;(async () => {
    try{
        await connectDB();
        application.listen(PORT,()=> {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch(error){
        console.log("Error connecting to the database", error.message);
        process.exit(1);
    }
})