import {Router } from 'express';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
import { register, login, logout,getProfile, forgotPassword, resetPassword, changePassword, updateUser } from '../controllers/user.controller.js';

const userRoutes = Router();

userRoutes.post('/register',upload.single("avatar"), register);
userRoutes.post('/login',login);
userRoutes.get('/logout',logout);
userRoutes.get('/me',isLoggedIn,getProfile);
userRoutes.post('/reset',forgotPassword);
userRoutes.post('/reset/:resetToken',resetPassword);
userRoutes.post('/changepassword',isLoggedIn,changePassword);
userRoutes.put('/update',isLoggedIn,upload.single("avatar"),updateUser);


export default userRoutes;