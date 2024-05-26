import express from 'express'
import { getalljob } from '../controllers/jobcontroller.js';
import { isauthorized } from '../middlewares/auth.js';
import { createjob ,getmyjob ,updatejob,deletejob,getjobdetails} from '../controllers/jobcontroller.js';



const router = express.Router();

router.get('/getall' , getalljob);
router.post('/createjob' , isauthorized , createjob);
router.get('/getmyjob' ,isauthorized, getmyjob);

// put use for update anything in databse
router.put('/update/:id' , isauthorized,updatejob);
router.delete('/delete/:id' , isauthorized,deletejob);
router.get('/:id' , isauthorized, getjobdetails);




export default router;