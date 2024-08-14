import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import { Stock } from './models/stockModel.js';
import stocksRoute from './routes/stocksRoute.js';
import cors from 'cors';

const app = express();

// middleware for parsing request body
app.use(express.json());

// middleware for handling CORS POLICY
// Option 1: Allow ALL origins with default of cors(*)
app.use(cors());
// Option 2: Allow Custom origins
// app.use(
//     cors({
//         origin: "https://localhost:3000",
//         methods: ['GET', 'POST', 'PUT', 'DELETE'],
//         allowedHeaders: ['Content-Type'],
//     })
// )

app.get('/', (request, response) => {
    console.log(request)
    return response.status(234).send("Welcome to the MERN Stack Tutorial!");
});

app.use('/stocks', stocksRoute);

mongoose.connect(mongoDBURL)
    .then(() => {
        console.log("App connected to database.");
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    })