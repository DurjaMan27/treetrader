import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config.js';
import {HumanMessagePromptTemplate} from '@langchain/core/prompts';
import dotenv from 'dotenv';
import fs from 'fs';

const executePrompt = async ({ tickerInput }) => {
  try {

    // Instantiation using from_template (recommended)
    const text = fs.readFile('./gemini_prompt.md');
    // const prompt = new PromptTemplate({
    //     inputVariables: ["ticker", "data"],
    //     template: template,
    // });
    // const formattedPrompt = prompt.format({ ticker: ticker, data: data });

    const message = HumanMessagePromptTemplate.fromTemplate(text);
    const formatted = await message.format({ ticker: tickerInput });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContext(formatted);
    const response = await result.response
    return response.text;
  } catch (error) {
    console.error('Error executing prompt:', error);
    return null;
  }
}

export default executePrompt;