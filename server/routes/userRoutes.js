import express from 'express';
import { registerUser, authUser } from '../controllers/userController.js';
import User from '../models/userModel.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(authUser);

router.get('/user/:username', async (request, response) => {
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

    if (!username) {
      console.log("username query parameter is required");
      console.log(request.query);
    }

    const user = await User.findOne({ username: username });

    return response.status(200).json({watchlist: user.stocks.watching})
  } catch (error) {
      response.status(500).send({ message: error.message })
  }
})

router.post('/addFunds', async (request, response) => {
  try {
    if (
      !request.body.username ||
      !request.body.addingFunds
    ) {
      return response.status(400).send({
        message: "send all required fields: username, addingFunds"
      });
    }

    const { username, addingFunds } = request.body;

    const user = await User.findOne({ username: username})

    const result = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          'totalFunds': user.totalFunds + addingFunds,
        }
      },
      {
        new: true
      }
    );

    return response.status(200).json({ totalFunds: user.totalFunds + addingFunds })

  } catch (error) {
    console.log(error);
    return response.status(400).json({ error })
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
  const { username, ticker, numShares, totalPrice, action } = request.body;

  const user = await User.findOne({ username: username });
  const portfolio = user.stocks.portfolio;
  const stock = portfolio.find(item => item.ticker === ticker);


  if(action === 'buy') {
    if(stock) {
      const result = await User.findOneAndUpdate(
        { _id: user._id, 'stocks.portfolio.ticker': ticker},
        {
          $set: {
            'stocks.portfolio.$.numShares': stock.numShares + numShares,
            'stocks.portfolio.$.priceInvested': stock.priceInvested + totalPrice,
            'stocks.portfolio.$.datePurchased': new Date(),
            'totalFunds': user.totalFunds - totalPrice,
          }
        },
        {
          new: true
        }
      );
    } else {
      const addingPackage = {
        ticker: ticker,
        numShares: numShares,
        datePurchased: new Date(),
        priceInvested: totalPrice,
      }

      const result = await User.findByIdAndUpdate(
        user._id,
        {
          $addToSet: {
            'stocks.portfolio': addingPackage,
          },
          $set : {
            'totalFunds': user.totalFunds - totalPrice,
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
  } else if (action === 'sell') {
    if(stock) {
      if (stock.numShares < numShares) {
        return response.status(404).json({ message: "Selling more shares than currently owned." });
      } else if (stock.numShares === numShares) {
        const result = await User.findOneAndUpdate(
          { _id: user._id, 'stocks.portfolio.ticker': ticker },
          {
            $pull: {
              'stocks.portfolio': { ticker: ticker }
            },
            $set : {
              'totalFunds': user.totalFunds + totalPrice
            }
          },
          {
            new: true,
          }
        )

      } else {
        const result = await User.findOneAndUpdate(
          { _id: user._id, 'stocks.portfolio.ticker': ticker},
          {
            $set: {
              'stocks.portfolio.$.numShares': stock.numShares - numShares,
              'stocks.portfolio.$.priceInvested': stock.priceInvested - totalPrice,
              'totalFunds': user.totalFunds + totalPrice,
            }
          },
          {
            new: true
          }
        );
  
      }
    } else {
      return response.status(404).json({ message: "Stock not found"})
    }
  }


  return response.status(200).json({ message: 'Successfully added to portfolio' });
})

export default router;