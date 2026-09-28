import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:2,
        maxlength:50,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/   
    },
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String,
    },
    role:{
        type:String,
        default:"user",
        enum:["user","seller"]
    }
});

const userModel = mongoose.model("users",userSchema);

export default userModel;