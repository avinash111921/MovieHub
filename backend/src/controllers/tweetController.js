import mongoose, {isValidObjectId, Mongoose} from 'mongoose';
import { Tweet } from "../models/tweetModels.js";
import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { deleteFromCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js';

const createTweet = asyncHandler(async (req,res) => {
    const { content } = req.body;
    if(!content) {
        throw new ApiError(400,"Content is required");
    }
    const posterLocalPath = req.files?.poster?.[0]?.path;
    if(!posterLocalPath){
        throw new ApiError(404,"Poster file is Missing");
    }  
    let poster;
    try {
        poster = await uploadOnCloudinary(posterLocalPath);
    } catch (error) {
        throw new ApiError(500,"failed to upload Post on cloudinary");
    }

    try {
        const postTweet = await Tweet.create({
            content,
            poster :poster.url,
            owner: req.user?._id,
        });
        if(!postTweet) {
            throw new ApiError(500,"Unable to create tweet");
        }
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            postTweet,
            "Successfully created tweet"
        ));
    } catch (error) {
        if(poster){
            await deleteFromCloudinary(poster.public_id);
        }
        throw new ApiError(
            500,
            "Something went wrong while creating poster"
        )
    }
})

const getAllTweets = asyncHandler(async(req,res) => {
    const tweets = await Tweet.find({})
    if(tweets.length === 0) {
        throw new ApiError(404,"No tweets found");
    }
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        tweets,
        "Successfully fetched tweets"
    ));
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    try {
        const tweets = await Tweet.find({ owner: userId })
            .populate('owner', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(new ApiResponse(200,tweets,"Successfully fetched user tweets"));
    } catch (error) {
        throw new Error('Failed to fetch user tweets');
    }
});

const updateTweet = asyncHandler(async(req,res) => {
    const {tweetId} = req.params;
    // const {userId} = req.user?._id;
    const {content} = req.body;
    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400,"Invalid tweet id");
    }
    if(!content) {
        throw new ApiError(400,"Content is required");
    }
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,{
            $set : {
                content
            }
        },{new : true});
    if(!updatedTweet) {
        throw new ApiError(404,"Tweet not found");
    }
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        updatedTweet,
        "Successfully updated tweet"
    ));
})

const updatePoster = asyncHandler(async(req,res) => {
    const posterLocalPath = req.file?.path;
    const {tweetId} = req.params;
    if(!posterLocalPath){
        throw new ApiError(400,"Poster file is missing");
    }
    const poster = await uploadOnCloudinary(posterLocalPath)
    if(!poster.url){
        throw new ApiError(400,"error while uploading poster")
    }
    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set : {
                poster : poster.url,
            }
    },{new : true})

    const oldPosterURL = tweet?.poster
    const deleteoldPoster = await deleteFromCloudinary(oldPosterURL)
    if(!deleteoldPoster){
        throw new ApiError(400,"Error while delete old Poster");
    }
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        tweet,
        "Poster image updated successfully"
    ))
})

const deleteTweet = asyncHandler(async(req,res)=> {
    const {tweetId} = req.params;
    const userId = req.user?._id;
    if(!userId) {
        throw new ApiError(400,"User id is missing");
    }
    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400,"Invalid tweet id");
    }
    if(!isValidObjectId(userId)) {
        throw new ApiError(400,"Invalid user id");
    }

    const findTweet = await Tweet.findOne({
        $and : [
            {
                owner : new mongoose.Types.ObjectId(userId)
            },
            {
                _id : new mongoose.Types.ObjectId(tweetId)
            }
        ]
    })

    if (!findTweet) { 
        return res
        .status(404)
        .json(new ApiError(
            404, 
            "You are not authorized to delete this tweet"
        )) 
    }
    const delTweet = await Tweet.findByIdAndDelete(tweetId);
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        delTweet,
        "Tweet deleted successfully!"
    ));
})


export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    getAllTweets,
    updatePoster,
}