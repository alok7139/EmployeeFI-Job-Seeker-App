import express from 'express'
import {register , login , logout,getuser} from '../controllers/usercontroller.js'
import {isauthorized} from '../middlewares/auth.js'


const router = express.Router();


router.post('/register' , register);
router.post('/login' , login);
router.get('/logout' , isauthorized, logout);
router.get('/getuser',isauthorized,getuser);



export default router;