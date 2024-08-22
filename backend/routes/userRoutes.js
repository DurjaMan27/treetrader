import express from 'express';
import { registerUser, authUser } from '../controllers/userController.js';
import User from '../models/userModel.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(authUser);

router.get('/:username', async (request, response) => {
  try {
    const { username } = request.params;

    const user = await User.findOne({ username: username });

    return response.status(200).json({
      username: user.username,
      email: user.email,
      totalFunds: user.totalFunds,
      stocks: user.stocks,
    })
  } catch (error) {
      console.log(error.message)
      response.status(500).send({ message: error.message })
  }
})

router.post('/watchlist/:ticker', async (request, response) => {
  try {
    if(
        !request.body.username ||
        (request.body.action !== 'add' && request.body.action !== 'remove')
    ) {
        return response.status(400).send({
            message: "send all required fields: username and ticker and choose one action (add or remove)"
        });
    }

    const username = request.body.username;
    const user = await User.findOne({ username: username });

    if (!user) {
      return response.status(400).send({
        message: "this user does not exist"
      })
    }

    const { ticker } = request.params;

    if (request.body.action === 'add') {
      const result = await User.findByIdAndUpdate(
        user._id,
        {
          $addToSet: {
            'stocks.watching': ticker,
          }
        },
        {
          new: true
        }
      );
      if(!result) {
        return response.status(404).json({ message: "Stock not found" });
      }
    } else if (request.body.action === 'remove') {
      const result = await User.findByIdAndUpdate(
        user._id,
        {
          $pull: {
            'stocks.watching': ticker,
          }
        },
        {
          new: true
        }
      );

      if(!result) {
        return response.status(404).json({ message: "Stock not found" });
      }
    }

    return response.status(200).send({ message: "User watch list updated successfully" })
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message })
  }
})

router.get('/watchlist', async (request, response) => {
  try {
    const username = request.query.username;

    const user = await User.findOne({ username: username });

    return response.status(200).json({watchlist: user.stocks.watching})
  } catch (error) {
      console.log(error.message)
      response.status(500).send({ message: error.message })
  }
})

router.get('/portfolio', async (request, response) => {
  try {
    const username = request.query.username;

    const user = await User.findOne({ username: username });

    return response.status(200).json({totalFunds: user.totalFunds, portfolio: user.stocks.portfolio})
  } catch (error) {
      console.log(error.message)
      response.status(500).send({ message: error.message })
  }
})

router.post('/portfolio', async (request, response) => {
  const { username, ticker, numShares, totalPrice } = request.body;
})

export default router;