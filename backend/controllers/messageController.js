import { User } from "../models/userModel.js"
import Message from "../models/messageModels.js"
import {uploadMultipleOnCloudinary,deleteFromCloudinary} from "../utils/cloudinary.js"
import {getReciverScoketID,io} from "../lib/socket.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"

const getUserforSidebar = asyncHandler(async(req,res) => {
    try {
        const loggedInUser = req.user._id;
        const filteredUser = await User.findById(loggedInUser).select("-password -refreshToken")
        res
        .status(200)
        .json(new ApiResponse(
            200,
            {filteredUser},
            "succesFully get LoggedIn User"
        ));
    } catch (error) {
        console.error("Error in getUserForSidebar", error.message);
        res
        .status(500)
        .json(new ApiError(
            500, 
            "Internal Server Error"
        ));
    }
})

const getMessage  = asyncHandler(async(req,res) => {
    try {
        const {id :userToChatId} = req.params;
        const myId =  req.user._id
        const messages = await Message.find({
            $or : [
                {senderId : myId,reciverId : userToChatId},
                {senderId : userToChatId,reciverId : myId}
            ]
        })
        res.status(200).json(new ApiResponse(200,{messages},"Successfully get message"))
    } catch (error) {
        console.log("Error in getMessage controller ",error.message);
        res.status(500).json(new ApiError(500,"Internal Server Error"))
    }
})

const sendMessage = asyncHandler(async(req,res) => {
    try {
        const {text} = req.body;
        const imageLocalPaths =  req.files ? req.files.map((file) => file.path) : [];
        const {id:reciverId} = req.params
        const senderId = req.user._id

        let messageImages = [];
        try {
            //upload image to cloudinary
            if (imageLocalPaths.length > 0) {
                messageImages = await uploadMultipleOnCloudinary(imageLocalPaths);
            }
        } catch (error) {
            throw new ApiError(500,"Failed to upload messageImage");
        }
        const newMessage = await Message.create({
            senderId,
            reciverId,
            text,
            imageUrls: messageImages
        })
        await newMessage.save();

        const reciverSocketId = await getReciverScoketID(reciverId);
        if(reciverSocketId){
            io.to(reciverSocketId).emit("newMessage", newMessage)
        }
        res.status(200).json(new ApiResponse(200,{newMessage},"Successfully send message"));

    } catch (error) {
        if(imageUrl){
            //delete image from cloudinary
            await deleteFromCloudinary(imageUrl)
        }
        console.log("Error in sendMessage controller ",error.message);
        res
        .status(500)
        .json(new ApiError(
            500,
            "Internal Server Error"
        ))
    }
})

export {
    getUserforSidebar,
    getMessage,
    sendMessage,
}


/* {
  "status": 200,
  "data": {
    "newMessage": {
      "_id": "message_id",
      "senderId": "sender_id",
      "reciverId": "reciver_id",
      "text": "Hello, check these images!",
      "imageUrls": [
        "https://res.cloudinary.com/your_cloud_name/image/upload/v12345/img1.jpg",
        "https://res.cloudinary.com/your_cloud_name/image/upload/v12345/img2.jpg"
      ],
      "createdAt": "2025-03-26T12:34:56Z"
    }
  },
  "message": "Message sent successfully"
} 
  */