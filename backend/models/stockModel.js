import mongoose from "mongoose";

const stockSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        symbol: {
            type: String,
            required: true,
        },
        industry: {
            type: String,
            required: true,
        },
        currPrice: {
            type: Number,
            required: true,
        },
        lastUpdated: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

export const Stock = mongoose.model('Stock', stockSchema)