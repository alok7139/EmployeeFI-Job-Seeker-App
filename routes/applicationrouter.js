import express from 'express'
import { isauthorized } from '../middlewares/auth.js';
import {jobseekerallapplication,jobseekerdeleteapplication,employerallapplication , postapplication} from '../controllers/applicationcontroller.js'



const router = express.Router();

router.post('/post/resume' , isauthorized , postapplication);
router.get('/jobseeker/getall' ,isauthorized, jobseekerallapplication)
router.get('/employee/getall' , isauthorized,employerallapplication)
router.delete('/delete/:id' , isauthorized , jobseekerdeleteapplication);



export default router;