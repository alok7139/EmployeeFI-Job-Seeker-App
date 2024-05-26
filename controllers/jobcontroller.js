import { Job } from "../models/jobschema.js";
import ErrorHandler from "../middlewares/error.js";
import { catchasyncerror } from "../middlewares/catchasyncerror.js";

export const getalljob = catchasyncerror(async(req,res, next) => {
    const jobs = await Job.find({expired:false});
    res.status(200).json({
        success:true,
        jobs,
    })
})

export const createjob = catchasyncerror(async(req,res,next) => {
    const {role} = req.user;

    if(role === "Job Seeker"){
        return next(new ErrorHandler("You are not the allow to access this resource" , 400));
    }

    const {title,description,category,city,country,location , fixedsalary,salaryFrom,salaryTo} =req.body;

    if(!title || !description || !category || !city || !country || !location ){
        return next(new ErrorHandler("please provide full details" , 400));
    }


    if((!salaryFrom || !salaryTo) && !fixedsalary){
        return next(new ErrorHandler("please either provide full deatils" , 400));
    }
    if(salaryFrom && salaryTo && fixedsalary){
        return next(new ErrorHandler("please provide one of the details",400));
    }

    const postedBy = req.user._id;
    const job = await Job.create({
        title,description , category , country, city , location ,fixedsalary,salaryFrom,salaryTo,postedBy,
    }) 

    res.status(200).json({
        success:true,
        message:"job posted successfully!",
        job,
    })

})

export const getmyjob = catchasyncerror(async(req,res,next) => {
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("You are not the allow to access this resource" , 400));
    }

    const myjobs = await Job.find({postedBy:req.user._id});
    res.status(200).json({
        success:true,
        myjobs,
    })

})

export const updatejob = catchasyncerror(async(req,res,next) => {
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("You are not the allow to access this resource" , 400));
    }
    const {id} = req.params;
    let job = await Job.findById(id);
    if(!job){
        return next(new ErrorHandler("😅 Oops, Job is not found",400))
    }
    job = await Job.findByIdAndUpdate(id,req.body, {
        new : true,
        runValidators:true,
        useFindAndModify:false,
    })

    res.status(200).json({
        success:true,
        job,
        message:"Job updated successfully!"
    })
})

export const deletejob = catchasyncerror(async(req,res,next) => {
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("You are not authorized user to delete this operation" ,400));
    }
    const {id} = req.params;
    let job = await Job.findById(id);
    if(!job){
        return next(new ErrorHandler("Oops 😅, Job is not found",400))
    }
    await job.deleteOne();
    res.status(200).json({
        success:true,
        message:"Job removed from this platform successfully!",
    })
})

export const getjobdetails = catchasyncerror(async(req,res,next) => {
    const {id} = req.params;
    try {
        const job = await Job.findById(id);
        if(!job){
            return next(new ErrorHandler("Not Found" , 404));
        }
        res.status(200).json({
            success:true,
            job,
        })
    } catch (error) {
        return next(new ErrorHandler("Invalid ID / castError",400));
    }
})