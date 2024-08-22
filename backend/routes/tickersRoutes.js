import express from 'express';
import { Ticker } from '../models/tickerModel.js';

const router = express.Router();

router.get('/', async (request, response) => {
  try {
      const tickerSymbols = await Stock.find({}, 'ticker');

      const tickerNames = tickers.map(ticker => ticker.ticker); // array of tickers

      return response.status(200).json({
          count: tickerSymbols.length,
          data: tickerNames
      })
  } catch (error) {
      console.log(error.message)
      response.status(500).send({ message: error.message })
  }
})


export default router;