import passport from 'passport';
import { Strategy } from 'passport-local';
import db from './db.js';
import bcrypt from 'bcrypt';

passport.use(
    "local",
    new Strategy(async function verify(username, password, cb) {
        try {
            const result = await db.query("SELECT * FROM users WHERE user_name = $1", [username]);
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const storedHashedPassword = user.user_hashed_password;
                bcrypt.compare(password, storedHashedPassword, (err, valid) => {
                    if (err) {
                        console.error("Error comparing passwords:", err);
                        return cb(err);
                    }
                    if (valid) {
                        return cb(null, user); // User is authenticated
                    } else {
                        return cb(null, false, { message: 'كلمة المرور غير صحيحة' }); // Invalid password
                    }
                });
            } else {
                return cb(null, false, { message: 'اسم المستخدم الذي ادخلته غير موجود، يمكنك الذهاب لتسجيل حساب إولا' }); // User not found
            }
        } catch (err) {
            console.error("Database error:", err);
            return cb(err); // Handle database error
        }
    })
);

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

export default passport;
