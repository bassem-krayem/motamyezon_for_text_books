import express from 'express';
import passport from 'passport';
import session from 'express-session';
import router from './routes/authRoutes.js';

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
app.use(express.static("public"));
    app.use(passport.initialize());
app.use(passport.session());

app.use(router);


app.listen(port, () => {
    console.log(`the server is running on http://localhost:${port}`);
});
