import User from '../models/User.js';
import passport from 'passport';

const loginPage = (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('login.ejs', {title: 'تسجيل الدخول'});
    }
};

const registerPage = (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('register.ejs', {title: 'إنشاء حساب'});
    }
};

const homePage = (req, res) => {
    if (req.isAuthenticated()) {
        res.render('home.ejs', {user: req.user, title: 'متميزون للكتب النصية'});
    } else {
        res.redirect('/beforeauth');
    }
};

const beforeAuthPage = (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('beforeAuth.ejs', {title: 'متميزون للكتب النصية'});
    }
};

const aboutPage = (req, res) => {
    res.render('about.ejs', {title: 'عن فريق متميزون', user: req.user})
}

const checkLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error("Authentication error:", err);
            return next(err);
        }
        if (!user) {
            return res.render('login.ejs', { error: info.message, title: 'تسجيل الدخول'});
        }
        req.login(user, (err) => {
            if (err) {
                console.error("Login error:", err);
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
};

const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
            }
            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
    });
};

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUsername = await User.findByUsername(username);
        const existingEmail = await User.findByEmail(email);

        if (existingUsername && existingEmail) {
            return res.render('register.ejs', {
                error: 'اسم المستخدم والبريد الإلكتروني مستخدمان بالفعل، الرجاء اختيار اسم مستخدم وبريد إلكتروني آخرين.',
                title: 'إنشاء  حساب',
            });
        } else if (existingUsername) {
            return res.render('register.ejs', {
                error: 'اسم المستخدم موجود بالفعل، الرجاء اختيار اسم مستخدم آخر.',
                title: 'إنشاء  حساب',
            });
        } else if (existingEmail) {
            return res.render('register.ejs', {
                error: 'البريد الإلكتروني مستخدم بالفعل، الرجاء استخدام بريد إلكتروني آخر.',
                title: 'إنشاء  حساب',
            });
        }

        // Proceed with creating the user
        const newUser = await User.createUser(username, email, password);

        req.login(newUser, (err) => {
            if (err) {
                console.error("Login error:", err);
                return res.redirect("/login");
            }
            res.redirect("/");
        });
    } catch (err) {
        console.error("Registration error:", err);
        res.redirect("/register");
    }
};

export {
    loginPage,
    registerPage,
    homePage,
    beforeAuthPage,
    aboutPage,
    checkLogin,
    logout,
    registerUser,
};
