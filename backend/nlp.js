require("dotenv").config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

// Middleware to parse JSON request bodies
app.use(express.json()); // This is the fix

// Function to analyze text with AI
const analyzeText = async (resumeText, jobDescription) => {
  const apiKey = "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";

  const headers = {
    "Authorization": `Bearer ${apiKey}`
  };

  // Combine resume text and job description into one string for the API
  const combinedText = `${resumeText} \n\nJob Description: \n${jobDescription}`;

  const data = {
    inputs: combinedText // Send a single string as input
  };

  try {
    const response = await axios.post("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", data, { headers });
    console.log('API Response:', response.data);
    return response.data; // This should be in the format you're expecting (fit_score and feedback)
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error; // Will be caught in the route handler
  }
};

/*
Accepts the resume and job description as inputs.
Validates the input data.
Sends this data to the external NLP API (e.g., Hugging Face or OpenAI).
Receives raw results from the NLP API and forwards them (without extensive processing) to the relevant internal logic or services.
*/

// Example Express.js route
app.post('/api/analyze', async (req, res) => {
  const { resume_text, job_description } = req.body;

  if (!resume_text || !job_description) {
    return res.status(400).json({ error: 'Please fill required fields' });
  }

  try {
    const result = await analyzeText(resume_text, job_description);

    // Check if the API response has a fit_score and feedback
    if (result.fit_score && result.feedback) {
      return res.status(200).json({
        fit_score: result.fit_score,
        feedback: result.feedback
      });
    } else {
      // If the response doesn't match expected data
      return res.status(400).json({ error: 'Unable to process the request. Unexpected data. Please try again later.' });
    }
  } catch (error) {
    // Return a 500 error for API failure or invalid response
    return res.status(500).json({ error: 'Unable to process the request. Please try again later.' });
  }
});


// Start the server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app; // Export the app for testing

/*
const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };
  
  const modelUrlSummary = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
  const modelUrl = 'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2';

  */