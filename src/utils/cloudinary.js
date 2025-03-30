import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config({
  path: "./.env"
})

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_CLOUD_KEY,
    api_secret : process.env.CLOUDINARY_CLOUD_SECRET
});

const uploadOnCloudinary = async (localFilePath) =>{
        try {
          if(!localFilePath) return null
          const response = await cloudinary.uploader.upload(localFilePath, {resource_type: "auto"}) //upload file on cloudinary
          // console.log("file is uploaded", response.url);
            fs.unlinkSync(localFilePath)
          return response
          
        } catch (error) {
            fs.unlinkSync(localFilePath) //  remove the locally saved file as when the upload operation got failed
            return null;
        }
}

export {uploadOnCloudinary} 