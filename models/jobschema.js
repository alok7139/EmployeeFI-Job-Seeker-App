import mongoose from 'mongoose'



const jobSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"please provide job title"],
        minLength:[3,"Job title must contain 3 characters"],
        maxLength:[30 , "Job title cannot exceed 30 characters"],
    },
    description:{
        type:String,
        required:[true,"Please provide job description"],
        minLength:[1,"Job description must contain 1 characters"],
        maxLength:[200 , "Job description cannot exceed 200 characters"],
    },
    category:{
        type:String,
        required:[true,"Job category is required"],
    },
    country:{
        type:String,
        required:[true,"Job country is required"],
    },
    city:{
        type:String,
        required:[true,"Job city is required"],
    },
    location:{
        type:String,
        required:[true,"Job location is required"],
    },
    fixedsalary:{
        type:Number,
 
    },
    salaryFrom: {
        type: Number,
      
    },
    salaryTo: {
        type: Number,
       
    },
    expired: {
        type: Boolean,
        default: false,
    },
    jobPostedOn: {
        type: Date,
        default: Date.now,
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },

})

export const Job = mongoose.model("Job" , jobSchema);