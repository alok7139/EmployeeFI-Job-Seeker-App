import mongoose, { mongo } from 'mongoose';

export  const dbconnection = () => {
    mongoose.connect(process.env.MONGO_URI , {
        dbName: "Employeedata"
    }).then(() => {
        console.log(`connected to databse`)
    }).catch((err) => {
        console.log(`error occured in databse ${err}`);
    })
}

