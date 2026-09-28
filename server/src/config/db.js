import mongoose from "mongoose";
import config from "./config.js";


const connectDb=async()=>{
    try {
       await mongoose.connect(config.MONGODB_URI) ;
       console.log("MongoDb connected...")
    } catch (error) {
        console.log("Failed to conenct MongoDb!!!")
    }
}

export default connectDb;