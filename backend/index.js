const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import the JWT library
const secretKey = 'cV4dNx5Edf&bV7z8qWkL2#mF3C9aT1UvYpH9Xg8J1oZ!7Txz'; 
const cors = require('cors')
const port = 5000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

const users = [];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function uniqueId() {
    let id;
    do {
        // Generate a random 9-digit number
        id = Math.floor(100000000 + Math.random() * 900000000);
    } while (users.find(u => u.id === id)); // Ensure the ID is unique
    return id.toString(); // Convert to string to maintain consistency
}

// Task 4: Registration endpoint
app.post('/api/register', async (req, res) => {
    const {email, password, username} = req.body;

    if (!email || !password || !username){
        res.status(404).json({ error: 'Please fill required fields'});
    }

    // TO DO : Validate that email is unique, hash password with bcrypt

    // Check email format
    if (!emailRegex.test(email)) {
        res.status(400).json({ error: 'Invalid email format' });
    }

    // Check email unique
    const isEmailTaken = users.some(user => user.email === email);
    if (isEmailTaken) {
        res.status(409).json({ error: 'Email already registered' });
    }

    try {
        // Hash the password with bcrypt
        const saltRounds = 10; // Adjust salt rounds as needed (higher is more secure but slower)
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user object with hashed password
        const newUser = {
            id: uniqueId(),
            email,
            password: hashedPassword, // Store the hashed password, not the plain text
            username
        };

        // Add the new user to the array
        users.push(newUser);

        // Send success response
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Task 5: Log-in endpoint
app.post('/api/login', (req, res) => {
    const {email, password} = req.body;

    if (!email || !password ){
        return res.status(404).json({ error: 'Missing username or password'});
    }

    // TO DO: Generate a JWT token with expiration.

    // Validate user credentials
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate a JWT token
    const payload = { email };
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    res.status(201).json(token);
});



// Start the server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app; // Export the app for testing