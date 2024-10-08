import express from 'express';
import * as authController from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.get('/login', authController.loginPage);
authRouter.post('/login', authController.checkLogin);
authRouter.get('/logout', authController.logout);
authRouter.get('/register', authController.registerPage);
authRouter.post('/register', authController.registerUser);
authRouter.get('/', authController.homePage);
authRouter.get('/beforeauth', authController.beforeAuthPage);

export default authRouter;
