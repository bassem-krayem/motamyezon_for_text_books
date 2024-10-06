import db from '../config/db.js';
import passport from '../config/passport.js';
import express from 'express';
import bcrypt from 'bcrypt';

const saltRounds = 10;

const loginFunction = (req, res) => {
    res.render('login.ejs');
}

const checkLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Pass the error message from Passport (info.message)
            return res.render('login.ejs', { error: info.message });
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
};

const logOutFunction = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {  // Destroy the session
            if (err) {
                console.error("Error destroying session:", err);
            }
            res.clearCookie('connect.sid');  // Clear the cookie
            res.redirect('/login');  // Redirect to login
        });
    });
};

const registerFunction = async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const checkResult = await db.query("SELECT * FROM users WHERE user_name = $1 OR user_email = $2", [
            username, email,
        ]);

        if (checkResult.rows.length > 0) {
            return res.render('register.ejs', { error: 'إسم المستخدم او البريد الالكتروني موجود، ادخل بيانات غير موجودة، ام قم بتسجيل الدخول' });
        } else {
            const hash = await bcrypt.hash(password, saltRounds); // Using await for bcrypt
            const result = await db.query(
                "INSERT INTO users (user_name, user_email, user_hashed_password) VALUES ($1, $2, $3) RETURNING user_id",
                [username, email, hash]
            );
            const user = result.rows[0];
            req.login(user, (err) => {
                if (err) {
                    console.error("Login error:", err);
                    return res.redirect("/login"); // Handle login error
                }
                console.log("success");
                res.redirect("/");
            });
        }
    } catch (err) {
        console.error("Database error:", err);
        res.redirect("/register"); // Redirect on error
    }
};

const getRegisterForm = (req, res) => {
    res.render('register.ejs');
}

const homePage = (req, res) => {
    if (req.isAuthenticated()) {
        res.render('home.ejs')
    } else {
        res.redirect('/beforeauth');
    }
};

const beforeAuth = (req, res) => {
    res.render('beforeAuth.ejs');
}

export { loginFunction, registerFunction, homePage, beforeAuth, getRegisterForm, checkLogin, logOutFunction, };
