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
    const text = fs.readFileSync(path.join(__dirname, 'gemini_prompt.md'), 'utf-8');

    const message = HumanMessagePromptTemplate.fromTemplate(text);
    const formatted = await message.format({ ticker: tickerInput });
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    if (!process.env.GEMINI_API_KEY) {
      return "couldn't find key"
    }
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