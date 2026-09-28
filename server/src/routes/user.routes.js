import express from 'express'
import { getMe, loginUser, logOut, registerUser } from '../controllers/user.controllers.js';
import { generateTokens } from '../utils/auth.utils.js';
import { loginValildator, registerValidator } from '../validators/auth.validator.js';


const router = express.Router();

router.post("/register",registerValidator, registerUser);
router.post("/login",loginValildator, loginUser);
router.post("/logout",logOut);
router.post("/me",getMe);
router.post("/refresh",generateTokens);


export default router;