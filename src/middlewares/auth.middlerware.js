import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
});


export const verifyJwt = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "").trim(); 

      // console.log("Access Token:", req.cookies?.accessToken);
      // console.log("Authorization Header:", req.header("Authorization"));


    if (!token) {
      throw new ApiError(400, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
    if (!decodedToken) {
      throw new ApiError(400, "Unauthorized request - Token Missing")
    }

    // console.log(decodedToken);
    
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    
    );
    
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid Token");
  }
});
