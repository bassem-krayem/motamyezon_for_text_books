import express from 'express';
import passport from 'passport';
import session from 'express-session';
import authRouter from './routes/authRoutes.js';
import bookRouter from './routes/bookRoutes.js'
import adminRouter from './routes/adminRoutes.js';

const app = express();
const port = 3000;

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 60* 1000,
        }
    })
);

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

app.use(authRouter);
app.use('/books', bookRouter);
app.use('/admin', adminRouter);


app.listen(port, () => {
    console.log(`the server is running on http://localhost:${port}`);
});
