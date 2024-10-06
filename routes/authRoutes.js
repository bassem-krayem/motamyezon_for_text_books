import express from 'express';
import passport from 'passport';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.get('/login', authController.loginFunction);
router.post('/login', authController.checkLogin);
router.get('/logout', authController.logOutFunction);
router.get('/register', authController.getRegisterForm);
router.post('/register', authController.registerFunction);
router.get('/', authController.homePage);
router.get('/beforeauth', authController.beforeAuth);

export default router;
