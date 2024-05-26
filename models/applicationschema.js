import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please provide your name"],
    },
    email:{
        type:String,
        validator:[validator.isEmail,"please provide valid email"],
        required:[true,"please provide your email"],
    },
    coverletter:{
        type:String,
        required:[true,"please provide your cover letter"],
    },
    phone:{
        type:Number,
        required:[true,"please provide your Phone No."],
    },
    address:{
        type:String,
        required:[true,"please provide your address"],
    },
    resume:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        },
    },
    applicantID:{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        role:{
            type:String,
            enum:["Job Seeker"],
            required:true,
        }
    },
    employeeID:{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        role:{
            type:String,
            enum:["Employee"],
            required:true,
        }
    },


}) 

export const Application = mongoose.model("Application" , applicationSchema);