import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please provide your name"],
        minLength: [3 , "name must contain atleast 3 characters"],
        maxLength: [20 , "name must not exceed 20 characters"],
    },
    email:{
        type:String,
        required:[true, "please provide your email"],
        validate: [validator.isEmail , "please provide valid email"],  
    },
    phone:{
        type:Number,
        required:[true,"please provide your number"],
    },
    password:{
        type:String,
        required:[true,"please provide your password"],
        minLength:[6, "password must contain 8 characters"],
        select:false,
    },
    role:{
        type:String,
        required:[true, "provide your role"],
        enum:["Job Seeker" , "Employee"],
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    
});

// hashing password

userSchema.pre("save" , async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password= await bcrypt.hash(this.password , 10);
})

// compare password
userSchema.methods.comparePassword = async function(enterpassword){
    return await bcrypt.compare(enterpassword , this.password);
};

// jsonweb token create for auth
userSchema.methods.generateJsonwebtoken = function() {
    return jwt.sign({id: this._id} , process.env.JWT_SECRET_KEY , {
        expiresIn:process.env.JWT_EXPIRE,
    });
};

export const User = mongoose.model("User" , userSchema); 