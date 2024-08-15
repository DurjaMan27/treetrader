import express from 'express';
import { Stock } from '../models/stockModel.js';

const router = express.Router();

// route to save a new stock
router.post('/', async (request, response) => {
    try {
        if(
            !request.body.name ||
            !request.body.symbol ||
            !request.body.industry ||
            !request.body.currPrice
        ) {
            return response.status(400).send({
                message: "send all required fields: name, symbol, industry, currPrice, lastUpdated"
            });
        }

        const newStock = {
            name: request.body.name,
            symbol: request.body.symbol,
            industry: request.body.industry,
            currPrice: request.body.currPrice
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
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const stock = await Stock.findById(id);

        return response.status(200).json({stock})
    } catch (error) {
        console.log(error.message)
        response.status(500).send({ message: error.message })
    }
})

// Route to update a stock
router.put('/:id', async (request, response) => {
    try {
        if(
            !request.body.name ||
            !request.body.symbol ||
            !request.body.industry ||
            !request.body.currPrice
        ) {
            return response.status(400).send({
                message: "send all required fields: name, symbol, industry, currPrice, lastUpdated"
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

export default router;