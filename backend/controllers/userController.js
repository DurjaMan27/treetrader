import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js'

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
      token: generateToken(user._id),
    });
  } else {
    res.status(400)
    throw new Error('Error Occurred!')
  }
});

const authUser = asyncHandler( async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });

  if(user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.statusCode(400);
    throw new Error('Invalid Username or Password')
  }
})

export { registerUser, authUser };