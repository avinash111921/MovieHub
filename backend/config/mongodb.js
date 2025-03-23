import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/movie`)
        console.log('MongoDB connected...');
    } catch (error) {
        console.error("DB coconnection error :", error.message);
        process.exit(1);
    }
}
export default connectDB;