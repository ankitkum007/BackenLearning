import { Router } from "express";
import { logOutUser, registerUser, loginUser, refreshAccessToken } from "../controllers/use.controller.js";
import { upload } from "../middlewares/multer.middlerware.js";
import { verifyJwt } from "../middlewares/auth.middlerware.js";


const userRouter = Router();

userRouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),  
    registerUser
)

userRouter.route("/login").post(loginUser)

userRouter.route("/logout").post(verifyJwt, logOutUser)

userRouter.route("/refresh-token").post(refreshAccessToken)

  

export default userRouter;
