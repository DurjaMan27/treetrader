import mongoose from "mongoose";

const tickerSchema = mongoose.Schema(
    {
        ticker: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

export const Ticker = mongoose.model('Ticker', stockSchema)