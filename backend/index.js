require("dotenv").config()

const express = require('express');
const fs = require('fs');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import the JWT library
const secretKey = `${process.env.JWT_SECRET_KEY}`; 
const cors = require('cors')
const port = 5000;
const path = require('path');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pdfParse = require('pdf-parse');
const multer = require('multer');
const upload = multer();
const axios = require("axios");
const { OpenAI } = require("openai");


app.use(express.json());
app.use(cors());

/*

----------------------------- Token Handling  -----------------------------------

*/

// TOKEN STORAGE
const tokensFile = path.resolve(__dirname, 'tokens.json');
if (!fs.existsSync(tokensFile)) {
    fs.writeFileSync(tokensFile, JSON.stringify([]));
}

function loadTokens() {
    const data = fs.readFileSync(tokensFile, 'utf-8');
    return JSON.parse(data);
}

function saveTokens(tokens) {
    try {
        fs.writeFileSync(tokensFile, JSON.stringify(tokens, null, 2));
    } catch (error) {
        console.error("Error saving tokens:", error);
    }
}

// VALIDATE TOKEN API
app.post('/api/isValidToken', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, secretKey);

        // Check if the token exists in tokens.json
        const tokens = loadTokens();
        const tokenExists = tokens.some(storedToken => storedToken.token === token);

        if (!tokenExists) {
            return res.status(401).json({ error: 'Invalid Token' });
        }

        res.status(200).json({ message: 'Token is valid', user: decoded });
    } catch (error) {
        console.error('Token validation error:', error);
        res.status(401).json({ error: 'Invalid Token' });
    }
});

/*

----------------------------- User Handling  -----------------------------------

*/
// USER STORAGE
const usersFile = path.resolve(__dirname, 'users.json');if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([]));
}

function loadUsers() {
    const data = fs.readFileSync(usersFile, 'utf-8');
    return JSON.parse(data);
}

function saveUsers(users) {
    try {
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error("Error saving users:", error);
    }
}

/*

----------------------------- Registration / Sign-up  -----------------------------------

*/

// REGISTER API 
app.post('/api/register', async (req, res) => {
    const {email, password, username} = req.body;

    if (!email || !password || !username){
        return res.status(404).json({ error: 'Please fill required fields'});
    }

    // Check email format
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    const users = loadUsers();

    // Check email unique
    if (users.find(user => user.email === email)) {
        return res.status(409).json({ error: 'Email already registered' });
    }

    try {
        // Hash the password with bcrypt
        const saltRounds = 10; // Adjust salt rounds as needed (higher is more secure but slower)
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user object with hashed password
        users.push({ email, password: hashedPassword, username });

        // Save user
        saveUsers(users);

        // Send success response
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/*

----------------------------- Login  -----------------------------------

*/
// LOGIN API
app.post('/api/login', async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password ){
        return res.status(404).json({ error: 'Missing username or password'});
    }

    const users = loadUsers(); 

    // Validate user credentials
    const user = users.find(user => user.email === email);
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid email.' });
    }
    try {
        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate a JWT token (valid for 1 hour)
        const token = jwt.sign({ email: user.email, username: user.username }, secretKey, { expiresIn: '1h' });
        //testing for 10s
        //const token = jwt.sign({ email: user.email, username: user.username }, secretKey, { expiresIn: '10s' });

        // Save the token to tokens.json
        const tokens = loadTokens();
        tokens.push({ token, email, createdAt: new Date().toISOString() });
        saveTokens(tokens);

        // Respond with the token
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error validating password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});


/*

----------------------------- Resume Uploading  -----------------------------------

*/

var g_resume_text;
var g_job_description_text;

const JOB_DESCRIPTION_TEXT_LIMIT = 10000;

// RESUME UPLOAD PDF
app.post("/api/resume-upload", upload.single('resume_file'), async (req, res) => {
    let file = req.file
    let text = req.body["resume"]
  
    if (!file && !text) {
        return res.status(400).json({
            "error": "File not found",
            "status": "error"
        })
    }
  
    // if file exists, set text to file contents
    if (file) {
        if (file.mimetype != "application/pdf") {
            return res.status(400).json({
                "error": "Invalid file type. Only PDF files are allowed.",
                "status": "error"
            })
        }
        
        if (file.size > 2000000) {
            return res.status(400).json({
                "error": "File is too big",
                "status": "error"
            })
        }
    
        try {
            const resume = await pdfParse(file.buffer)
            text = resume.text
        } catch {
            res.status(500).json({
                "message": "Error parsing PDF",
                "status": "error"
            })
        }
    }
    
    // send text to NLP
    g_resume_text = text;
    
    res.status(200).json({
        "message": "Resume uploaded successfully.",
        "status": "success",
        "text": text
    })
});

// RESUME UPLOAD TEXT
app.post("/api/job-description", async (req, res) => {
    let description = req.body["job-description"]
  
    if (!description) {
        return res.status(400).json({
            "error": "Job description not provided.",
            "status": "error"
        })
    }
  
    description = description.trim();
    
    if (description.length > JOB_DESCRIPTION_TEXT_LIMIT) {
        return res.status(400).json({
            "error": "Job description exceeds character limit.",
            "status": "error"
        })
    }
  
    // send description to NLP
    g_job_description_text = description;
  
    res.status(200).json({
        "message": "Job description submitted successfully.",
        "status": "success"
    })
})


/*

----------------------------- NLP API  -----------------------------------

*/

// CALL FIT SCORE MODEL
async function getFitScore(sentences) {
    const API_KEY = process.env.HUGGING_FACE_API_KEY;
    const API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2";

    const headers = {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
    };

    const data = {
        inputs: {
            source_sentence: g_resume_text,  // Resume text
            sentences: [g_job_description_text]   // Job description text
        }
    };

    try {
        const response = await axios.post(API_URL, data, { headers });
        return response.data;
    } catch (error) {
        console.error("Error calling Hugging Face API:", error.response ? error.response.data : error.message);
        throw new Error("Failed to process request.");
    }
}

// CALL FEEDBACK MODEL
async function getFeedback(resume_text, job_description) {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "user", 
                    content: `You are a professional career coach. Provide 3 distinct 
                    pieces of constructive feedback for the following resume to align 
                    it better with the given job description. Each feedback point should 
                    focus on a different aspect of the resume and be brief, no more 
                    than 1 sentence per feedback point. Do not number them. Also provide
                    the category of the feedback. For example, if your feedback is about
                    the user's skills or lack thereof, then the category for that feedback
                    is "Skills". Each piee of feedback should be related to a different
                    skill. Format your response like so that we can use it in our codebase.
                    For example: 
                    "Skill 1": "Feedback 1", "Skill 2": "Feedback 2", "Skill 3": "Feedback3"

                    Job Description:
                    ${job_description}

                    Resume:
                    ${resume_text}

                    Feedback:` 
                }
            ]
        });
        
        const feedbackText = completion.choices[0].message.content;
        // Split the feedback into an array of sentences by looking for sentence-ending punctuation
        const feedbackArray = feedbackText
            .split('\n')  // Split by line
            .map(item => item.trim()) // Trim spaces
            .filter(item => item.length > 0); // Remove empty items

        const feedbackJson = feedbackArray.reduce((acc, item) => {
            const [key, value] = item.split(/:\s(.+)/);
            acc[key.trim().replace(/^"|"$/g, '')] = value.replace(/^"|"$/g, ''); // Remove quotes around value
            return acc;
          }, {});

        return feedbackJson; // Return feedback as an array of sentences
    } catch (error) {
        console.error("Error generating completion:", error);
        throw new Error("Failed to generate feedback.");
    }
}

async function getMissingKeywords(resume_text, job_description) {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "user", 
                    content: `You are a professional career coach. 
                        Provide a list of up to 5 keywords that are in the job 
                        description and not in the resume. Make sure the keywords are not in the resume. If they sound similar, do not include it. List only the keywords, one after the other,
                        separated by a comma and without numbering or hyphenating. Make sure the keywords
                        are most relevant to the job description, prioritizing hard skills and 
                        experience over location and vague terms. Capitalize each one.

                    Job Description:
                    ${job_description}

                    Resume:
                    ${resume_text}

                    Feedback:` 
                }
            ]
        });
        
        const content = completion.choices[0].message.content;

        // Split the feedback into an array of sentences by looking for sentence-ending punctuation
        const contentArray = content
            .split(", ")  // Split by period followed by space (end of sentence)
            .map(item => item.trim()) // Trim spaces
            .filter(item => item.length > 0); // Remove empty items

        return contentArray; // Return feedback as an array of sentences
    } catch (error) {
        console.error("Error generating completion:", error);
        throw new Error("Failed to generate feedback.");
    }
}

async function getMatchedKeywords(resume_text, job_description) {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "user", 
                    content: `You are a professional career coach. 
                        Provide a list of up to 5 keywords that are both in the job 
                        description and in the resume. They must be present in both texts. List only the keywords, one after the other,
                        separated by a comma and without numbering or hyphenating. Make sure the keywords
                        are most relevant to the job description, prioritizing hard skills and 
                        experience over location and vague terms. Capitalize each one.

                    Job Description:
                    ${job_description}

                    Resume:
                    ${resume_text}

                    Feedback:` 
                }
            ]
        });
        
        const content = completion.choices[0].message.content;

        // Split the feedback into an array of sentences by looking for sentence-ending punctuation
        const contentArray = content
            .split(", ")  // Split by period followed by space (end of sentence)
            .map(item => item.trim()) // Trim spaces
            .filter(item => item.length > 0); // Remove empty items

        return contentArray; // Return feedback as an array of sentences
    } catch (error) {
        console.error("Error generating completion:", error);
        throw new Error("Failed to generate feedback.");
    }
}

async function getSuggestions(resume_text, job_description) {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "user", 
                    content: `You are a professional career coach looking at the following resume to align it better with the 
                    given job description. Give a suggestion on what skills are needed Give a suggestion on what experiences should be added. Give a suggestion on how the format of the resume can be better.
                   There should be a total of 3 brief suggestions, no more than 1 sentence per suggestion. Do not number or add labels to the categories.

                    Job Description:
                    ${job_description}

                    Resume:
                    ${resume_text}

                    Feedback:` 
                }
            ]
        });
        
        const feedbackText = completion.choices[0].message.content;

        // Split the feedback into an array of sentences by looking for sentence-ending punctuation
        const feedbackArray = feedbackText
            .split(/(?<=\.)\s+/)  // Split by period followed by space (end of sentence)
            .map(item => item.trim()) // Trim spaces
            .filter(item => item.length > 0); // Remove empty items

        return feedbackArray; // Return feedback as an array of sentences
    } catch (error) {
        console.error("Error generating completion:", error);
        throw new Error("Failed to generate feedback.");
    }
}

//ANALYZE RESUME AND JOB DESC
app.post('/api/analyze', async (req, res) => {
    
    try {
        // Extract resume and job description from the request body
        let resume_text = req.body["resume_text"];
        let job_descriptions = req.body ["job_description"];

        // Validate input
        if (!resume_text || !job_descriptions) {
            return res.status(400).json({ error: "Invalid input data. Both resume and job description are required." });
        }        

        // Fetch fit score from Hugging Face model
        console.log("Fetching fit score...");
        const sentences = [g_resume_text, g_job_description_text];
        const fitScoreResponse = await getFitScore(sentences);
        const fitScore = Math.round(fitScoreResponse[0] * 100); // Convert to percentage and round it


        // Fetch feedback from OpenAI model
        console.log("Fetching feedback...");
        const feedback = await getFeedback(g_resume_text, g_job_description_text);

        const missingKeywords = await getMissingKeywords(g_resume_text, g_job_description_text);

        const suggestions = await getSuggestions(g_resume_text, g_job_description_text);
        const matchedKeywords = await getMatchedKeywords(g_resume_text, g_job_description_text);

        //console.log("Data feedback type: ", Array.isArray(suggestions)); -> suggestions is an array

        // Send the result as the response
        res.status(200).json({
            "message": "Submitted successfully.",
            "status": "success", 
            "fit_score": fitScore,
            "feedback": feedback, 
            "missing_keywords": missingKeywords,
            "suggestions": suggestions, 
            "matched_keywords": matchedKeywords
        });
        
    } catch (error) {
        console.error("Unexpected error:", error.message);
        res.status(500).json({
            error: "Failed to generate analysis results."
        });
    }
});


// Start the server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app; // Export the app for testing