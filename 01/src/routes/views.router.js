import {Router} from 'express';
import User from '../services/db/daos/models/User.js';

const router = Router();

router.get('/',(req,res)=>{
    res.render('index',{});
});


export default router;