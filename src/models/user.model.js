import mongoose ,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})

const useSchema = new Schema(
    {
        username: {
            type: String,
            require: true,
            unique: true,
            lowercase: true,
            trim: true,
            index:true
        },
        email: {
            type: String,
            require: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            require: true,
            trim: true,
            index: true
        },
        avatar:{
            type: String,
            require: true
        },
        coverImage: {
            type: String,
        }
        ,
        watchHistory: [
            {
                type :Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            require: [true, "Password is required"]
        },
        refreshToken :{
            type : String,
        }
    },
    {timestamps: true}
)

useSchema.pre("save" ,async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next()
});

useSchema.methods.isPasswordCorrect = async function(password) {
     return await bcrypt.compare(password, this.password)
}

useSchema.methods.genAccessToken = function(){
     return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        "P2SAc2Ou4l9d5GlpYWyUZRYtNHM6",
        {
            expiresIn: "1d"
        }
    )
}
useSchema.methods.genRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        "U2XDs389PTVB8xtfRlixPb4luUD7",
        {
            expiresIn: "10d"

        }
    )
}

export const User = mongoose.model("User", useSchema)