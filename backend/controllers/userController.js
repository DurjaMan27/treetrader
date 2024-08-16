import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne(
    {
      $or: [
        { username: username },
        { email: email }
      ]
    }
  )

  if(userExists) {
    res.status(400)
    throw new Error('This username or email already exists');
  }

  const user = await User.create({
    username,
    email,
    password
  });

  if(user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400)
    throw new Error('Error Occurred!')
  }

});

export default registerUser;