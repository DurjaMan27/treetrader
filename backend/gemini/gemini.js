import GeminiAPI from 'gemini-api';
import { GEMINI_API_KEY } from '../config.js';
import {HumanMessagePromptTemplate} from '@langchain/core';
import fs from 'fs';

const executePrompt = async ({ tickerInput, dataInput }) => {
  try {

    const gemini = new GeminiAPI({
      apiKey: GEMINI_API_KEY,
    });

    // Instantiation using from_template (recommended)
    const text = fs.readFile('./gemini_prompt.md');
    // const prompt = new PromptTemplate({
    //     inputVariables: ["ticker", "data"],
    //     template: template,
    // });
    // const formattedPrompt = prompt.format({ ticker: ticker, data: data });

    const message = HumanMessagePromptTemplate.fromTemplate(text);
    const formatted = await message.format({ ticker: tickerInput, data: dataInput })

    const response = await gemini.complete({
      prompt: formattedPrompt
    });
    return response.text;
  } catch (error) {
    console.error('Error executing prompt:', error);
    return null;
  }
}

export default executePrompt;