import express from 'express';
import { registerUser, authUser } from '../controllers/userController.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(authUser);

router.post('/test', async (request, response) => {
  try {
    console.log("reached test");
    console.log(request);
    throw new Error
  } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
  }
});

export default router;