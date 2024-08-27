import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import { Stock } from './models/stockModel.js';
import stocksRoutes from './routes/stocksRoutes.js';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import tickersRoutes from './routes/tickersRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

const app = express();

// middleware for parsing request body
app.use(express.json());
app.use(cors(
  // {
  //   origin: ["https://treetrader.vercel.app"],
  //   methods: ["POST", "GET"],
  //   credentials: true,
  // }
));

app.get('/', (req, res) => {
  res.send("API is running...");
})

app.use('/stocks', stocksRoutes);
app.use('/users', userRoutes);
app.use('/tickers', tickersRoutes)

app.use(notFound);
app.use(errorHandler);

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