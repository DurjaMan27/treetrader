import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js'

const registerUser = asyncHandler(async (request, response) => {
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
    response.status(201).json({
      token: "exists",
    })
  } else {
    const user = await User.create({
      username,
      email,
      password
    });

    if(user) {
      response.status(201).json({
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
  }
});

const authUser = asyncHandler( async (request, response) => {
  const { email, password } = request.body;
  console.log("BODY")
  console.log(request.body);

  const user = await User.findOne({ email: email });

  console.log(user);

  if(user && (await user.matchPassword(password))) {
    console.log("FOUND HIM")
    response.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    console.log("wrong password!!")
    response.statusCode(400);
    throw new Error('Invalid Username or Password')
  }
})

export { registerUser, authUser };