import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
    {
        senderId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        reciverId :{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        text : {
            type : String
        },
        imageUrls : {
            type: [String], // Updated to store multiple image URLs
            default: []
        }
    },{timestamps : true}
)

const Message = mongoose.model("Message",messageSchema);
export default Message;