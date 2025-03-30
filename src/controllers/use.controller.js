import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const accessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    
    const accessToken = user.genAccessToken();
    const refreshToken = user.genRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
        
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong!");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  // console.log("email", email, "fullName", fullname, "username", username);
  // console.log(req.body);

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLoacalPath = req.files?.coverImage[0]?.path;

  let coverImageLoacalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage > [0]
  ) {
    coverImageLoacalPath = req.files.coverImage[0].path;
  } else {
    coverImageLoacalPath = "";
  }

  // console.log(req.files?.avatar[0]);
  // console.log(avatarLocalPath);
  // console.log(coverImageLoacalPath);
  

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLoacalPath);

  if (!avatar) {
    throw new ApiError(401, "Avatar file is required");
  }

  const user = await User.create({
    fullname,
    avatar: avatar?.url || "",
    coverImage: coverImage?.url || "",
    email,
    password,
    username 
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );


  if (!createdUser) {
    throw new ApiError(500, "Somthing went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User register SuccessFully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  // console.log(req.body);
  

  if (!(username || email)) {
    throw new ApiError(400, "Username or password is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email } ],
  });

  // console.log(user);
  

  if (!user) {
    throw new ApiError(400, "User don't Exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  // console.log(isPasswordValid);
  

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Password");
  }

  const { accessToken, refreshToken } = await accessAndRefreshToken(user._id);

  console.log( accessAndRefreshToken(user._id));
  

  const loggedInId = await User.findById(user._id).select(
    "-password -refreshToken"
  );  
  

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
        200,
        {
            user: loggedInId, accessToken, refreshToken
        },
        "User logged in Successfully"
    )
  )
});

const logOutUser = asyncHandler( async (req, res)=> {
   await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            },
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true,
      };

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))

})

const refreshAccessToken = asyncHandler(async (req, res) =>{

  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(400, "Unaunthorized request")
  }

  const decodeToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  )
const user = awaitUser.findById(decodeToken?._id)

if (!user) {
  throw new ApiError(401, "Invalid refresh token")
}

if (incomingRefreshToken !== user?.refreshToken) {
  throw new ApiError(401, "Refresh token is expried")
}

const options ={
  httpOnly: true,
  secure: true
}

 const {newRefreshToken, accessToken} = await accessAndRefreshToken(user._id)

 return res 
 .status(200)
 .cookie("accessToken", accessToken, options)
 .cookie("refreshToken", newRefreshToken, options)
 .json(
  new ApiResponse(
    200,
    {accessToken, refreshToken:newRefreshToken},
    " Access token refreshed"
  )
 )

})





export { registerUser, loginUser, logOutUser,refreshAccessToken };
