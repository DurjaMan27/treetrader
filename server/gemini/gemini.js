import { GoogleGenerativeAI } from '@google/generative-ai';
// import { GEMINI_API_KEY } from '../config.js';
import {HumanMessagePromptTemplate} from '@langchain/core/prompts';
import dotenv from 'dotenv';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url'

dotenv.config();

const executePrompt = async (tickerInput) => {
  try {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    // const text = fs.readFileSync(path.join(__dirname, 'gemini_prompt.md'), 'utf-8');
    const text = "You are an intelligent investing machine, capable of using internet resources and your mathematical calculations to deal with large sets of time-series data and make relevant calculations and decisions.\nYou will be given a stock ticker [ticker], representing a popular company that trades in relevant/large-scale trading indexes or exchanges. Additionally, you must use publicly available historical open, high, low, and close prices for each of the respective ticker's trading days, along with the total volume traded for that day.\n\nYour job is to look through the time series data and recent news articles to provide insight and suggestions as to whether this stock would be beneficial on a long-term, hold trading strategy. Your advice will be taken into account for new investors who would like to get into understanding technical indicators when trading stocks. Your decision will combined with other pieces of information to develop a reasonable trading strategy for first-time investors.\n\nUsing the [ticker] and its historical stock market data, please calculate the 50-day simple moving average, 100-day simple moving average, 50-day exponential moving average, Bollinger Bands, MACD, RSI, momentum indicators, and any other indicators that you feel are important.\nBased on this data, provide your input as to whether or not an investor should buy, sell, or hold this stock. Additionally, provide brief explanations (1-2 sentences maximum) for your reasoning using the above indicators or recent news stories relating to the stock. When providing your explanation, be sure to explain why the indicators positioning corresponds to your recommendation.\n\nHere is the important information:\n[ticker]: {ticker}\n\nReturn your response in a string format where the ticker key has the ticker value, the recommendation key has the recommendation (buy/sell/hold), and the explanation key has the explanation for the recommendation.Do not include anything else.\n\nReturn your response in the following format...\nticker: ticker\nrecommendation: (buy/hold/sell)\nexplanation: concise sentences explaining decision\n\nDo not include anything else in your response, save for those three items. Do not include any formatting, simply return it in the string format. Your response should only be those three lines."
    if (!process.env.GEMINI_API_KEY) {
      return "couldn't find key"
    }
    const message = HumanMessagePromptTemplate.fromTemplate(text);
    const formatted = await message.format({ ticker: tickerInput });
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(formatted.content.toString());
    const response = await result.response
    return response.text();
  } catch (error) {
    console.error('Error executing prompt:', error);
    return error;
  }
}

export default executePrompt;