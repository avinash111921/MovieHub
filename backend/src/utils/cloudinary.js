import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({
    path:"./.env"
});

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath){
            return null;
        }
        const response = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type : "auto",
            }
        )
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}
const getPublicId = (url) => {
    const urlWithoutParams = url.split("?")[0];
    const parts = urlWithoutParams.split("/");
    const publicIdWithExtension = parts.pop();
    const publicId = publicIdWithExtension.split(".")[0];
    return publicId;
}

const deleteFromCloudinary = async (url) => {
    try {
        const publicId = getPublicId(url);
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.log("Error deleting from cloudinary", error);
        return null;
    }
}

export {uploadOnCloudinary, deleteFromCloudinary};
