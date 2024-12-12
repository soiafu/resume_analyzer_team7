require("dotenv").config()

const express = require('express');
const fs = require('fs');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import the JWT library
const secretKey = process.env.SECRET_KEY; 
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


// RESUME UPLOAD PDF
app.post("/api/resume-upload", upload.single('resume_file'), async (req, res) => {
    let file = req.file
    console.log(file)
  
    if (!file) {
        return res.status(400).json({
            "error": "File not found",
            "status": "error"
        })
    }
  
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
        res.status(200).json({
            "message": "Resume uploaded successfully.",
            "status": "success",
            "text": resume.text,
        })
        // send resume to NLP

    } catch {
        res.status(500).json({
            "message": "Error parsing PDF",
            "status": "error"
        })
    }
});

// RESUME UPLOAD TEXT
app.post("/api/job-description", async (req, res) => {
    let resume = req.body["job-description"]
  
    if (!resume) {
        return res.status(400).json({
            "error": "Job description not provided.",
            "status": "error"
        })
    }
  
    resume = resume.trim();
    
    if (resume.length > 5000) {
        return res.status(400).json({
            "error": "Job description exceeds character limit.",
            "status": "error"
        })
    }
  
    // send resume to NLP
  
    res.status(200).json({
        "message": "Job description submitted successfully.",
        "status": "success"
    })
})

// Start the server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

app.post('/api/fit-score', async (req, res) => {
    let text = req.body["resume_text"];
    let des = req.body ["job_description"];

    if(text==('') || des==('')){
        res.status(400).json({
            "error": "Invalid input data. Both resume and job description are required.",
            "status": "failure"
        })
    }

    else{
        res.status(200).json({
            "message": "Submitted successfully.",
            "status": "success", 
            //mock data
            "fit_score": 85,
            "feedback": [
                "Include experience with AWS services.",
                "Add projects demonstrating REST API development."
            ], 
            "matched_keywords": ["Python", "REST APIs", "AWS"]
        })
    }
})

module.exports = app; // Export the app for testing