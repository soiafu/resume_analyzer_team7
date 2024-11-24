import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

// Mock the registration request
mock.onPost('/api/registration').reply(201, {
  message: 'User registered successfully',
  user: {
    email: 'user@example.com',
    username: 'newUser'
  }
});

// Mock the login request
mock.onPost('/api/login').reply(200, {
  message: 'Login successful',
  token: 'fake-jwt-token'
});

export default mock;
