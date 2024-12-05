import dotenv from 'dotenv'; // Import dotenv package
dotenv.config(); // Load environment variables from .env file

import fetch from 'node-fetch'; 

// Get the API key from environment variables
const apiKey = process.env.HUGGING_FACE_API_KEY;

const headers = {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json'
};

const modelUrlSummary = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
const modelUrl = 'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2';

// Example sentences to compare
const sentence1 = "I love programming with JavaScript!";
const sentence2 = "JavaScript is my favorite programming language.";

// Function to get the similarity score using Hugging Face's API
async function getTextSimilarity(text1, text2) {
  try {
    // Send a POST request to the Hugging Face API
    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        inputs: [text1, text2], // Pass both sentences for comparison
      }),
    });

    // Handle the API response
    if (!response.ok) {
      throw new Error('Error: ' + response.statusText);
    }

    const data = await response.json();
    console.log(data); // The full response (usually contains embeddings)
    
    // Extract the similarity score (distance between embeddings)
    const similarityScore = data[0].score; // Similarity score
    console.log(`Similarity score between the sentences: ${similarityScore}`);

  } catch (error) {
    console.error('Error fetching data from Hugging Face API:', error);
  }
}

// Call the function to compare the two sentences
getTextSimilarity(sentence1, sentence2);