import express from 'express';
import { Stock } from '../models/stockModel.js';
import yahooFinance from 'yahoo-finance2';

const router = express.Router();

// route to save a new stock
router.post('/', async (request, response) => {
    try {
        if(
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

// Route to GET specific stock from the database
router.get('/:ticker', async (request, response) => {
    try {
        const { ticker } = request.params;
        const stock = await Stock.findOne({ ticker: ticker });

        return response.status(200).json({stock})
    } catch (error) {
        console.log(error.message)
        return response.status(200).json({name: 'error'})
    }
})

// Route to update a stock
router.put('/:id', async (request, response) => {
    try {
        if(
            !request.body.name ||
            !request.body.ticker ||
            !request.body.industry ||
            !request.body.currPrice ||
            ! request.body.lastPrice
        ) {
            return response.status(400).send({
                message: "send all required fields: name, ticker, industry, currPrice, lastPrice"
            });
        }

        const { id } = request.params;

        const result = await Stock.findByIdAndUpdate(id, request.body);

        if(!result) {
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
        if(
            !request.body.tickers
        ) {
            return response.status(400).send({
                message: "send all required fields: tickers"
            });
        }

        for(let i = 0; i < request.body.tickers.length; i++) {

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

            const currPrice = priceData[-1].adjClose.toFixed(2);
            const lastPrice = priceData[-2].adjClose.toFixed(2);

            const companyData = await yahooFinance.autoc(request.body.tickers[i])
            let name = "";
            for(let j = 0; j < companyData.Result.length; j++) {
                if(companyData.Result[j].symbol === request.body.tickers[i]) {
                    name = companyData.Result[j].name;
                    break;
                }
            }

            const newStock = {
                name: name,
                ticker: request.body.ticker[i],
                industry: industry,
                currPrice: currPrice,
                lastPrice: lastPrice,
            };
            const stock = await Stock.create(newStock);
        }

        return response.status(201).send(stock)
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

export default router;