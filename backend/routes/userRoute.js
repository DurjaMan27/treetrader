import express from 'express';
import { User } from '../models/userModel.js';

const router = express.Router();

// route to save a new user
router.post('/', async (request, response) => {
    try {
        if(
            !request.body.username ||
            !request.body.email ||
            !request.body.password
        ) {
            return response.status(400).send({
                message: "send all required fields: username, email, password."
            });
        }

        const newUser = {
            username: request.body.username,
            email: request.body.email,
            password: request.body.password,
        };
        const user = await User.create(newUser);
        return response.status(201).send(user)
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to GET all stocks from the database
router.get('/', async (request, response) => {
    try {
        const users = await User.find({});
        // return response.status(200).json(stocks);
        return response.status(200).json({
            count: users.length,
            data: users
        })
    } catch (error) {
        console.log(error.message)
        response.status(500).send({ message: error.message })
    }
})

// Route to GET specific stock from the database
router.get('/:username', async (request, response) => {
    try {
        const { username } = request.params;

        const user = await Stock.findOne({ username: username});

        return response.status(200).json({user})
    } catch (error) {
        console.log(error.message)
        response.status(500).send({ message: error.message })
    }
})

// Route to delete a stock
router.delete('/:username', async (request, response) => {
    try {
        const { username } = request.params;

        const user = await User.findOne({ username: username })
        const result = await Stock.findByIdAndDelete(user._id);

        if (!result) {
            return response.status(404).json({ message: "User not found" });
        }

        return response.status(200).send({ message: "User account deleted successfully" });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
});

export default router;