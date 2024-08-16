import express from 'express';
import { User } from '../models/userModel.js';
import { registerUser, authUser } from '../controllers/userController.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(authUser);

export default router;