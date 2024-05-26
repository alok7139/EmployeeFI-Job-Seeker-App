import { Application } from "../models/applicationschema.js";
import ErrorHandler from "../middlewares/error.js";
import { catchasyncerror } from "../middlewares/catchasyncerror.js";
import cloudinary from 'cloudinary'
import { Job } from "../models/jobschema.js";

export const employerallapplication = catchasyncerror(async(req,res,next) => {
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("you are not allowed member" ,400));
    }
    const {_id} = req.user;

    const application  =await Application.find({"employeeID.user": _id});
    res.status(200).json({
        success:true,
        application,
    })
})


export const jobseekerallapplication = catchasyncerror(async(req,res,next) => {
    const {role} = req.user;
    if(role === "Employee"){
        return  next(new ErrorHandler("you are not allowed member" ,400));
    }
    const {_id} = req.user;

    const application  =await Application.find({"applicantID.user": _id});
    res.status(200).json({
        success:true,
        application,
    })
})

export const jobseekerdeleteapplication  = catchasyncerror(async(req,res,next) => {
    const {role} = req.user;
    if(role === "Employee"){
        return next(new ErrorHandler("you are not allowed member" ,400));
    }
    const {id}= req.params;
    const application = await Application.findById(id);
    if(!application){
        return next(new ErrorHandler("Oops 😅, application not found" ,400));
    }
    await application.deleteOne();
    res.status(200).json({
        success:true,
        message:"Application removed successfully"
    })
})

export const postapplication = catchasyncerror(async(req,res,next) => {
    const {role} = req.user;
    if(role === "Employee"){
        return next(new ErrorHandler("you are not allowed member" ,400));
    }
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Resume file required!" , 400));
    }
    const {resume} = req.files;

    const allowedformats =  ['image/png' , 'image/jpeg' , 'image/webp'];

    if(!allowedformats.includes(resume.mimetype)){
        return next(new ErrorHandler("Invalid file format, upload a PNG , JPEG , WEBP format",400));
    }
    const cloudinaryresponse  = await cloudinary.uploader.upload(
        resume.tempFilePath
    );
    // console.log(cloudinaryresponse);
    if(!cloudinaryresponse || cloudinaryresponse.error){
        console.log("cloudinary Error" , cloudinaryresponse.error || "Unknown cloudinary response");
        return next(new ErrorHandler("Failed to upload resume!" , 500));
    };
    

    const {name,email,coverletter,phone,address,jobId} =req.body;

    const applicantID = {
        user:req.user._id,
        role: "Job Seeker"
    };
    if(!jobId){
        return next(new ErrorHandler("Job not found" ,400));
    }

    const jobdetails = await Job.findById(jobId);

    if(!jobdetails){
        return next(new ErrorHandler("Job not found" , 400));
    }

    const employeeID = {
        user:jobdetails.postedBy,
        role:"Employee",
    };
    if(!name || !email || !coverletter  || !phone || !address || !applicantID || !employeeID || !resume){
       return next(new ErrorHandler("please update full details" , 400));
    }

    const application = await Application.create({
        name,email,phone,coverletter,address,applicantID,employeeID,
        resume:{
            public_id: cloudinaryresponse.public_id,
            url: cloudinaryresponse.secure_url,
        }
    })

    res.status(200).json({
        success:true,
        message:"Application submitted successfully!",
        application,
    })
    console.log(cloudinaryresponse);

    
})