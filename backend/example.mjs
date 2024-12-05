import dotenv from 'dotenv'; // Import dotenv package
dotenv.config(); // Load environment variables from .env file

import fetch from 'node-fetch'; 

// Get the API key from environment variables
const apiKey = process.env.HUGGING_FACE_API_KEY;

const headers = {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json'
};

const modelUrl = 'https://api-inference.huggingface.co/models/gpt2';  // Example: GPT-2 model URL

// Make a POST request to the Hugging Face model endpoint
async function queryModel(inputText) {
  const response = await fetch(modelUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ inputs: inputText })
  });

  const data = await response.json();
  console.log(data);  // Output the model's response
}

// Example usage
queryModel("Hello, Hugging Face!").catch(err => console.error(err));
