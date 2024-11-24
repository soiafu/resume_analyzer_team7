import axios from 'axios';

describe('Sign Up Testing', () => {
    test('invalid input', async () => {
        const newUser = {
            email: 'example.com', 
            username: 'testing',
            password: 'testPassword',
        };
        
        try {
            await axios.post('http://localhost:5000/api/register', newUser);
        } catch (error) {
            expect(error.response.status).toBe(400); 
            expect(error.response.data.error).toBe('Invalid email format');
        }
    });

    test('should successfully register a user', async () => {
        const newUser = {
            email: 'success@example.com',
            username: 'testing',
            password: 'testPassword',
        };

        const response = await axios.post('http://localhost:5000/api/register', newUser);
        expect(response.status).toBe(201); 
        expect(response.data.message).toBe('User registered successfully');
    });

    test('user already registered', async () => {
        const newUser = {
            email: 'alreadyregistered@example.com',
            username: 'testingregistered',
            password: 'testPassword',
        };

        // First, register the user
        await axios.post('http://localhost:5000/api/register', newUser);

        try {
            const response = await axios.post('http://localhost:5000/api/register', newUser);
        } catch (error) {
            expect(error.response.status).toBe(409);
            expect(error.response.data.error).toBe('Email already registered');
        }
    });
});


describe('Log In Testing', () => {
    test('Successful Login', async () => {
        const newUser = {
            email: 'alreadyregistered@example.com',
            password: 'testPassword',
        };
        

        const response = await axios.post('http://localhost:5000/api/login', newUser);
        expect(response.status).toBe(200); 
        //expect(response.data.message).toBe('Success'); returns token
    });

    test('Unsuccessful Login', async () => {
        const newUser = {
            email:  'alreadyregistered@example.com',
            password: 'wrongPassword',
        };

        try {
            await axios.post('http://localhost:5000/api/login', newUser);
        } catch (error) {
            expect(error.response.status).toBe(401); 
            expect(error.response.data.error).toBe('Invalid email or password');
        }

    });

    test('Invalid Input', async () => {
        const newUser = {
            email: '',
            password: 'testPassword',
        };

        try {
            const response = await axios.post('http://localhost:5000/api/login', newUser);
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data.error).toBe('Missing username or password');
        }
    });
});