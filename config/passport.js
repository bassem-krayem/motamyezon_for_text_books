import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findByUsername(username);

            if (!user) {
                return done(null, false, {
                    message: 'اسم المستخدم الذي ادخلته غير موجود، يمكنك الذهاب لتسجيل حساب إولا',
                });
            }

            const isValidPassword = await User.comparePassword(password, user.user_hashed_password);

            if (!isValidPassword) {
                return done(null, false, { message: 'كلمة المرور غير صحيحة' });
            }

            return done(null, user); // Authentication successful
        } catch (err) {
            console.error("Authentication error:", err);
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.user_id); // Assuming user_id is the primary key
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;
