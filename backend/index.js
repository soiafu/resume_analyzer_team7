const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// **************************************************************
// Put your implementation here
// If necessary to add imports, please do so in the section above

const users = [];

function uniqueId() {
    let id;
    do {
        // Generate a random 9-digit number
        id = Math.floor(100000000 + Math.random() * 900000000);
    } while (users.find(u => u.id === id)); // Ensure the ID is unique
    return id.toString(); // Convert to string to maintain consistency
}

// Task 4: Registration endpoint
app.post('/register', (req, res) => {
    const {email, password, username} = req.body;

    if (!email || !password || !username){
        return res.status(404).json({ error: 'Please fill required fields'});
    }

    // TO DO : Validate that email is unique, hash password with bcrypt

    // return res.status(400);


    const newUser = {
        id: uniqueId(),
        email,
        password,
        username
    };

    users.push(newUser); // adding to the array

    res.status(201).json({ message: 'User registered'});
});


// Task 5: Log-in endpoint
app.post('/register', (req, res) => {
    const {email, password} = req.body;

    if (!email || !password ){
        return res.status(404).json({ error: 'Missing username or password'});
    }

    // Generate a JWT token with expiration.

    // return res.status(400);


    res.status(201).json(token);
});



// Start the server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app; // Export the app for testing