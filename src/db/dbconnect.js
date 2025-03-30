import mongoose from "mongoose"

const connectDb = async () =>{
    try {        
       const dbconnect = await mongoose.connect(process.env.MONGO_DB)
       console.log(`connection done!`)
       
    } catch (error) {
        console.log("DB connection fail", error);
        process.exit(1)
        
    }
}

export default connectDb;

