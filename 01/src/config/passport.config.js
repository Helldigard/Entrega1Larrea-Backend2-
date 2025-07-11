import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PRIVATE_KEY } from '../utils.js'; 
import userModel from '../services/db/models/user.model.js';

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwtCookieToken'];
    }
    return token;
};

const initializePassport = () => {
    passport.use(
        'jwt',
        new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY,
        },
        async (jwt_payload, done) => {
            try {
            const user = await userModel.findById(jwt_payload.id);
            if (!user) return done(null, false);
            return done(null, user);
            } catch (error) {
            return done(error, false);
            }
        }
        )
    );
};

export default initializePassport;
