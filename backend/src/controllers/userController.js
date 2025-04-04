import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import  {User} from "../models/userModel.js"
import {uploadOnCloudinary,deleteFromCloudinary} from '../utils/cloudinary.js';
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);           
        if(!user){
            throw new ApiError(401,"User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        //Because MongoDB use his validation  before save ... if not validate not save in dataBase 
        await user.save({validateBeforeSave : false})
        return {accessToken , refreshToken};
        
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating refreshToken and AcessToken"
        )
    }
}

const registerUser = asyncHandler(async (req,res) => {
    try {
        const {fullname,email,password,username} = req.body;

        if([fullname,username,email,password].some((field) => field?.trim() === "")){
            throw new ApiError(400,"All fields are required");
        }

        const existedUser = await User.findOne({
            $or : [{username},{email}]
        });

        if(existedUser){
            throw new ApiError(409,"user with email or userName already exists");
        }

        const avatarLocalPath = req.files?.avatar?.[0]?.path;
        const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

        if(!avatarLocalPath){
            throw new ApiError(404,"Avatar file is Missing");
        }  

        let avatar;
        try {
            avatar = await uploadOnCloudinary(avatarLocalPath);
        } catch (error) {
            // console.error("Cloudinary upload error:", error);
            throw new ApiError(500,"failed to upload Avatar");
        }

        let coverImage;
        if (coverImageLocalPath) {
            try {
                coverImage = await uploadOnCloudinary(coverImageLocalPath);
            } catch (error) {
                // console.error("Failed to upload cover image:", error);
                throw new ApiError(500,"failed to upload Cover Image");
            }
        }

        const user = await User.create({
            username:username.toLowerCase(),
            fullname,
            email,
            avatar : avatar.url,
            coverImage : coverImage?.url || "",
            password,
        });

        const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        if(!createdUser){
            throw new ApiError(500,"Something went wrong while registering a User ");
        }

        const options = {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
        }

        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(new ApiResponse(
            200,
            {user : createdUser,accessToken,refreshToken},
            null
        ));
    } catch (error) {
        console.error("Registration error:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Something went wrong during registration");
    }
})

const loginUser = asyncHandler(async (req,res) => {
    const {email, password, username} = req.body;
    
    if(!email && !username){
        throw new ApiError(400,"Email or username is required");
    }

    let user;
    if(email) {
        user = await User.findOne({email});
    } else {
        user = await User.findOne({username});
    }

    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid credentials");
    }
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //jab hum cookies send karta hai to options design karna padta hai
    const options = {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200 ,{user : loggedInUser,accessToken,refreshToken},"User logIn successfully"))
})

const logOutUser = asyncHandler(async (req,res) => {

    await User.findByIdAndUpdate(req.user._id,
        {
            $unset : {
                refreshToken :1,
            },
        },
        {new : true}
    );
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",   //true in production and false in development
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logout successfully"));
})

const refreshAcessToken = asyncHandler(async(req,res) => {

/*     console.log("Cookies:", req.cookies); // Debugging
    console.log("Request Body:", req.body); // Debugging */

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthourized request 1");
    }

    try {
        const decodeToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodeToken?._id);

        if(!user){
            throw new ApiError(404,"Invalid refresh Token");
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(402,"Invalid or expired refreshToken");
        }

        const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(user._id);

        await User.findByIdAndUpdate(user._id,{
            $set : {
                refreshToken : newRefreshToken
            }
        },{new : true})
        
        const options = {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
        };
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(200,{accessToken,refreshToken : newRefreshToken},"Acess token refreshed successfully")
        )

    } catch (error) {
        throw new ApiError(
            401,
            "soemthing went wrong while refreshing acess Token"
        )
    }
})

const changeCurrentPassword = asyncHandler(async(req,res) => {

    const {oldPassword,newPassword} = req.body
    const user = await User.findById(req.user?._id);

    if(!user){
        return res
        .status(404)
        .json({success:false,message:"User not found"})
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid password");
    }
    user.password = newPassword;
    await user.save({validateBeforeSave:false});
    return res.status(200)
    .json(new ApiResponse(200,{},"Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req,res) => {
    return res.status(200).json(new ApiResponse(200,req.user,"Current User fetched SuccessFully"));
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    // console.log(req.body)
    const { fullname, email, username } = req.body;
    // console.log('Received values:', fullname, email, username);
    // Check if at least one field is being updated
    if (!fullname && !email && !username) {
        throw new ApiError(400, "At least one field is required for updating");
    }

    try {
        const updatedFields = {};
        if (fullname) updatedFields.fullname = fullname;
        if (email) updatedFields.email = email;
        if (username) updatedFields.username = username.toLowerCase(); // Keep username lowercase

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            { $set: updatedFields },
            { new: true }
        ).select("-password");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
    } catch (error) {
        throw new ApiError(500, "An error occurred while updating account details");
    }
});


const updateUserAvatar = asyncHandler(async (req,res) => {
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar.url){
        throw new ApiError(400,"error while uploading Avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                avatar : avatar.url,
            },
        },{new : true}
    ).select("-password");

    const oldAvatarURL = req.user?.avatar
    const deleteOldAvatar = await deleteFromCloudinary(oldAvatarURL)
    if(!deleteOldAvatar){
        throw new ApiError(400,"Error while delete old avatar");
    }
    return res.status(200)
    .json(new ApiResponse(200,user,"Avatar image updated successfully"))
})
const updateUserCoverImage =asyncHandler(async(req,res) => {
    const coverImageLocalPath = req.file?.path;
    if(!coverImageLocalPath){
        throw new ApiError(402,"CoverImage file is missing")
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!coverImage.url){
        throw new ApiError(400,"Error while uploading coverImage");
    }
    const user = await User.findByIdAndUpdate(req.user._id,{
        $set:{
            coverImage : coverImage.url,
        },
    },{new : true}).select("-password");

    const oldCoverImageURL  = req.user?.coverImage;
    const deleteOldcoverImage = await deleteFromCloudinary(oldCoverImageURL)

    if(!deleteOldcoverImage){
        throw new ApiError(400,"Error while delete old coverImage")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,user,"cover image update succesfully"))
})

export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAcessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
}