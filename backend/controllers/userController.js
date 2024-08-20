import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js'

const registerUser = asyncHandler(async (request, response) => {
  console.log("here I am!")
  console.log(request.body)
  const { username, email, password } = request.body;

  const userExists = await User.findOne(
    {
      $or: [
        { username: username },
        { email: email }
      ]
    }
  )

  if(userExists) {
    response.status(400)
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
    response.status(400)
    throw new Error('Error Occurred!')
  }
});

const authUser = asyncHandler( async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username: username });

  if(user && (await user.matchPassword(password))) {
    response.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    response.statusCode(400);
    throw new Error('Invalid Username or Password')
  }
})

export { registerUser, authUser };