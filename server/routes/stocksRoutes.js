import express from 'express';
import { Stock } from '../models/stockModel.js';
import yahooFinance from 'yahoo-finance2';
import executePrompt from '../gemini/gemini.js';

const router = express.Router();

// route to save a new stock
router.post('/', async (request, response) => {
  try {
    if (
      !request.body.name ||
      !request.body.ticker ||
      !request.body.industry ||
      !request.body.currPrice ||
      !request.body.lastPrice
    ) {
      return response.status(400).send({
        message: "send all required fields: name, ticker, industry, currPrice, lastPrice"
      });
    }

    const newStock = {
      name: request.body.name,
      ticker: request.body.ticker,
      industry: request.body.industry,
      currPrice: request.body.currPrice,
      lastPrice: request.body.lastPrice,
    };
    const stock = await Stock.create(newStock);
    return response.status(201).send(stock)
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to GET all stocks from the database
router.get('/', async (request, response) => {
  try {
    const stocks = await Stock.find({});
    // return response.status(200).json(stocks);
    return response.status(200).json({
      count: stocks.length,
      data: stocks
    })
  } catch (error) {
    console.log(error.message)
    response.status(500).send({ message: error.message })
  }
})

router.get('/tickerdata/:ticker', async (request, response) => {
  try {
    const { ticker } = request.params;

    const queryOptions = {
      period1: '2000-01-01'
    }
    const result = await yahooFinance.historical(ticker, queryOptions);

    let data = []
    for(let i = 0; i < result.length; i++) {
      data.push({ x: new Date(result[i].date), y: [result[i].open, result[i].high, result[i].low, result[i].close]})
    }

    return response.status(200).json({ data: data })
  } catch (error) {
    console.log(error.message)
    return response.status(200).json({ name: error})
  }
})

router.get('/tickerrec/:ticker', async (request, response) => {
  try {
    const { ticker } = request.params;

    const result = await executePrompt(ticker);
    return response.status(200).json({ recommendation: result });
  } catch (error) {
    console.log(error);
    return response
  }
})

// Route to GET specific stock from the database
router.get('/ticker/:ticker', async (request, response) => {
  try {
    const { ticker } = request.params;
    const stock = await Stock.findOne({ ticker: ticker });

    return response.status(200).json({ stock })
  } catch (error) {
    console.log(error.message)
    return response.status(200).json({ name: 'error' })
  }
})

// Route to update a stock
router.put('/:id', async (request, response) => {
  try {
    if (
      !request.body.name ||
      !request.body.ticker ||
      !request.body.industry ||
      !request.body.currPrice ||
      !request.body.lastPrice
    ) {
      return response.status(400).send({
        message: "send all required fields: name, ticker, industry, currPrice, lastPrice"
      });
    }

    const { id } = request.params;

    const result = await Stock.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: "Stock not found" });
    }

    return response.status(200).send({ message: "Stock updated successfully" })
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message })
  }
});
// Route to delete a stock
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Stock.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: "Stock not found" });
    }

    return response.status(200).send({ message: "Stock deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message })
  }
});

router.post('/addAll', async (request, response) => {
  try {
    let step = 0;

    if (
      !request.body.tickers
    ) {
      return response.status(400).send({
        message: "send all required fields: tickers"
      });
    }

    step += 1;


    for (let i = 0; i < request.body.tickers.length; i++) {
      const findingStock = await Stock.findOne({ ticker: request.body.tickers[i] })
      if (findingStock === null) {
        const industryData = await yahooFinance.insights(request.body.tickers[i], {
          lang: 'en-US',
          reportsCount: 0,
          region: 'US'
        })
        const industry = industryData.companySnapshot.sectorInfo

        const priceData = await yahooFinance.historical(request.body.tickers[i], {
          period1: "2024-08-01",
          interval: "1d",
        })
        const companyData = await yahooFinance.search(request.body.tickers[i], {
          quotesCount: 5,
          newsCount: 0,
        })

        let name = "";
        for (let j = 0; j < companyData.quotes.length; j++) {
          if (companyData.quotes[j].symbol === request.body.tickers[i]) {
            name = companyData.quotes[j].shortname;
            break;
          }
        }

        const currPrice = priceData[priceData.length - 1].adjClose.toFixed(2);
        const lastPrice = priceData[priceData.length - 2].adjClose.toFixed(2);

        const newStock = {
          name: name,
          ticker: request.body.tickers[i],
          industry: industry,
          currPrice: currPrice,
          lastPrice: lastPrice,
        };
        const stock = await Stock.create(newStock);
      } else {

        const updatedAt = new Date(findingStock.updatedAt);
        const current = new Date();

        updatedAt.setHours(0,0,0,0);
        current.setHours(0,0,0,0);

        if (updatedAt.getTime() !== current.getTime()) {
          const priceData = await yahooFinance.historical(request.body.tickers[i], {
            period1: "2024-08-19",
            interval: "1d",
          })

          const currPrice = priceData[priceData.length - 1].adjClose.toFixed(2);
          const lastPrice = priceData[priceData.length - 2].adjClose.toFixed(2);

          const result = await Stock.findOneAndUpdate(
            { ticker: request.body.tickers[i] },
            {
              currPrice: currPrice,
              lastPrice: lastPrice,
            },
            {
              new: true,
            }
          );

        } else {
          return response.status(201).send("Already updated today");
        }
      }
    }

    return response.status(201).send("All have been created");
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.get('/setofTickers', async (request, response) => {
  try {
    let stockList = []
    for(let i = 0; i < request.query.tickers.length; i++) {
      const stock = await Stock.findOne({ ticker: request.query.tickers[i] });
      stockList.push(stock)
    }

    return response.status(200).json({ list: stockList });
  } catch (error) {
    console.log(error.message)
    return response.status(200).json({ name: 'error' })
  }
})


export default router;