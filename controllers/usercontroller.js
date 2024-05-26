import ErrorHandler from "../middlewares/error.js";
import { catchasyncerror } from "../middlewares/catchasyncerror.js";
import { User } from "../models/userschema.js";
import {sendtoken} from '../utils/jwttoken.js'



export const register =  catchasyncerror(async(req,res,next)  => {
    const {name,email,phone,role,password}  =req.body;

    if(!name || !email || !phone || !role || !password){
        return next(new ErrorHandler("Please provide all details" , 400));
    }

    const isEmail = await User.findOne({email});

    if(isEmail){
        return next(new ErrorHandler("User already exists " , 400))
    }

    const user = await User.create({
        name,email,password,phone,role,
    })

     sendtoken(user,201,res,"user registered successfully");
})

export const login = catchasyncerror(async(req,res,next) => {
    const {email,password,role} = req.body;

    if(!email || !password || !role){
        return next(new ErrorHandler("Invalid details" , 400))
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password" , 400));
    }

    const ispasswordmatch = await user.comparePassword(password);
    if(!ispasswordmatch){
        return next(new ErrorHandler("Invalid email or password" , 400));
    }

    if(user.role !== role){
        return next(new ErrorHandler("User with this role not found" , 400));
    }
    sendtoken(user,201,res,"User loggedIn successfully");

})

export const logout = catchasyncerror(async(req,res,next) => {
    res.status(201).cookie("token","" , {
        httpOnly:true,
        expires: new Date(Date.now()),
        secure:true,
        sameSite:"None",
    }).json({
        success:true,
        message: "User logged out successfully!",
    })
})

export const getuser = catchasyncerror(async(req,res,next) => {
    const user = req.user;
    res.status(200).json({
        success:true,
        user,
    })
})