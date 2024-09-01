import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js'

const registerUser = asyncHandler(async (request, response) => {
  const { username, email, password, totalFunds } = request.body;

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
      username: username,
      totalFunds: totalFunds,
      email: email,
      password: password,
      stocks: {
        portfolio: [],
      }
    });

    if(user) {
      response.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        stocks: user.stocks,
        totalFunds: user.totalFunds,
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

  const user = await User.findOne({ email: email });

  if(user && (await user.matchPassword(password))) {
    response.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      totalFunds: user.totalFunds,
      stocks: user.stocks
    });
  } else {
    response.status(201).json({
      token: "exists",
    })
  }
})

export { registerUser, authUser };