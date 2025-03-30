// require('dotenv').config({path: './env'})

import connectDb from "../src/db/dbconnect.js"
import dotenv from "dotenv"
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
});

connectDb()
.then( ()=> {
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`Server in runing at port : ${process.env.PORT}`);
    })
})
.catch( (err)=> {
    console.log("connection failed" , err);
    
})


