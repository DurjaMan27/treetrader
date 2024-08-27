import GeminiAPI from 'gemini-api';
import YOUR_GEMINI_API_KEY from '../config.js';
import PromptTemplate from langchain_core.prompts;
import fs from 'fs';

fs.readFile('Input.txt', (err, data) => {
  if (err) throw err;

  console.log(data.toString());
});

const gemini = new GeminiAPI({
  apiKey: YOUR_GEMINI_API_KEY, // Replace with your actual API key
});

prompt

const executePrompt = async (prompt) => {
  try {

    // Instantiation using from_template (recommended)
    prompt = PromptTemplate.from_template("Say {foo}")
    prompt.format(foo="bar")

    const response = await gemini.complete({
      prompt: fs.readFile('./gemini_prompt.txt')
    });
    return response.text;
  } catch (error) {
    console.error('Error executing prompt:', error);
    return null;
  }
}

export default executePrompt;