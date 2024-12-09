
/*

This file is just for testing out different nlp models

*/

const axios = require('axios');

// Hugging Face API URL for gpt2-large model
const apiUrl = "https://api-inference.huggingface.co/models/openai-community/gpt2-large";
const API_KEY = "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"; // Replace with your API key from Hugging Face

const headers = {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
};

// Function to generate text based on a prompt using the gpt2-large model
async function generateText(prompt) {
    // Set up the input data with the prompt and parameters
    const data = {
        inputs: prompt,
        parameters: {
            max_length: 30, // Maximum length of the generated text
            num_return_sequences: 5 // Number of generated sequences
        },
    };

    try {
        // Call the Hugging Face API for text generation
        const response = await axios.post(apiUrl, data, { headers });
        const generatedTexts = response.data;

        // Display the generated texts
        console.log("Generated Texts:");
        generatedTexts.forEach((text, index) => {
            console.log(`Sequence ${index + 1}: ${text.generated_text}`);
        });
    } catch (error) {
        console.error("Error calling Hugging Face API:", error.message);
    }
}

// Example usage: Using a sample prompt
const prompt = "Hello, I'm a language model,";

// Generate text based on the prompt
generateText(prompt);
