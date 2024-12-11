
/*

This file is just for testing out different nlp models

*/

// Import necessary libraries
const { OpenAI } = require("openai");
require("dotenv").config();

// Load environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error("Please set your OpenAI API key in a .env file.");
    process.exit(1);
}

// Initialize OpenAI API client
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Define the resume and job description
const resume = `Experienced software engineer with over 5 years of development experience. Proficient in Python, JavaScript, and cloud computing. Passionate about building scalable and efficient applications.`;
const jobDescription = `We are looking for a skilled software engineer to join our team. The ideal candidate will have a strong background in software development, experience with cloud technologies, and the ability to work on large-scale applications. Strong proficiency in Python and JavaScript is required.`;

// Define the async function to get the feedback
async function getFeedback() {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "user", 
                    content: `You are a professional career coach. Provide constructive feedback on the following resume to align it better with the given job description. Max 100 words.

                    Job Description:
                    ${jobDescription}

                    Resume:
                    ${resume}

                    Feedback:` 
                }
            ]
        });
        
        console.log(completion.choices[0].message.content); // Output the feedback
    } catch (error) {
        console.error("Error generating completion:", error);
    }
}

// Call the function to get the feedback
getFeedback();