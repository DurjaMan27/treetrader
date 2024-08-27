import GeminiAPI from 'gemini-api';
import YOUR_GEMINI_API_KEY from '../config.js';
import { PromptTemplate } from langchain_core.prompts;
import fs from 'fs';

fs.readFile('Input.txt', (err, data) => {
  if (err) throw err;

  console.log(data.toString());
});

const gemini = new GeminiAPI({
  apiKey: GEMINI_API_KEY,
});

const executePrompt = async ({ ticker, data }) => {
  try {

    // Instantiation using from_template (recommended)
    const template = fs.readFile('./gemini_prompt.md');
    const prompt = new PromptTemplate({
        inputVariables: ["ticker", "data"],
        template: template,
    });
    const formattedPrompt = prompt.format({ ticker: ticker, data: data });

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