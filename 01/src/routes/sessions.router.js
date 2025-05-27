import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/current', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({ status: 'success', user: req.user });
    }
);

export default router;
