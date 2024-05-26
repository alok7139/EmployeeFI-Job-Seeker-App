import express from 'express'
import { config } from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import userrouter from './routes/userroute.js'
import jobrouter from './routes/jobrouter.js'
import applicationrouter from './routes/applicationrouter.js'
import { dbconnection} from './database/dbconnection.js'
import { errormiddleware } from './middlewares/error.js';



const app = express();
config({path: './.env'});

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET" ,"PUT" , "DELETE" , "POST"],
    credentials:true,
}))

app.use(cookieParser());

// only filter out json data not other data
app.use(express.json());
//  string to json format
app.use(express.urlencoded({extended:true}));

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir: "/tmp/",
}));

app.use('/get/user' , userrouter );
app.use('/get/job',jobrouter);
app.use('/get/application' , applicationrouter);


dbconnection();

app.use(errormiddleware );
export default app;
