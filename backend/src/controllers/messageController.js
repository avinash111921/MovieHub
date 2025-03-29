import { User } from "../models/userModel.js"
import Message from "../models/messageModels.js"
import {uploadOnCloudinary,deleteFromCloudinary} from "../utils/cloudinary.js"
import {getReciverScoketID,io} from "../lib/socket.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"

const getUserforSidebar = asyncHandler(async(req,res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUser = await User.find({
            _id : {$ne : loggedInUserId}
        })
        .select("-password -refreshToken")

        res
        .status(200)
        .json(new ApiResponse(
            200,
            filteredUser,
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
        const { id : userToChatId } = req.params;
        const myId =  req.user._id;
        const messages = await Message.find({
            $or : [
                {senderId : myId,reciverId : userToChatId},
                {senderId : userToChatId,reciverId : myId}
            ]
        })
        res
        .status(200)
        .json(new ApiResponse(
            200,
            messages,
            "Successfully get message"
        ));
    } catch (error) {
        console.log("Error in getMessage controller ",error.message);
        res
        .status(500)
        .json(new ApiError(
            500,
            "Internal Server Error"
        ))
    }
})

const sendMessage = asyncHandler(async(req,res) => {
    try {
        const {text} = req.body;
        const {id:reciverId} = req.params;
        const senderId = req.user._id;
        const imageLocalPath =  req.files?.messageImage?.[0]?.path;

        let messageImage;
        try {
            //upload image to cloudinary
            if (imageLocalPath) {
                messageImage = await uploadOnCloudinary(imageLocalPath);
            }
        } catch (error) {
            throw new ApiError(500,"Failed to upload messageImage");
        }
        const newMessage = await Message.create({
            senderId,
            reciverId,
            text,
            image: messageImage?.url || ""
        })

        await newMessage.save({validateBeforeSave : false});

        const reciverSocketId = await getReciverScoketID(reciverId);

        if(reciverSocketId){
            io.to(reciverSocketId).emit("newMessage", newMessage)
        }
        res
        .status(200)
        .json(new ApiResponse(
            200,
            newMessage,
            "Successfully send message"
        ));
    } catch (error) {
        if(messageImage){
            //delete image from cloudinary
            await deleteFromCloudinary(messageImage.public_id)
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

/* 
{
    "message": "Successfully send message",
    "statusCode": 200,
    "data": {
        "_id": "660a1e7c5f1b5e0024c9d70b",
        "senderId": "660a1e7c5f1b5e0024c9d70a",
        "reciverId": "660a1e7c5f1b5e0024c9d70c",
        "text": "Check this image!",
        "image": "https://res.cloudinary.com/example/image/upload/v1700000000/sample.jpg",
        "__v": 0
    },
    "success": true
} */