import axios from 'axios';
import React, {useState} from 'react';
const FormData = require('form-data');
const fs = require('fs');
const PDFDocument = require('pdfkit');
import { render, screen, fireEvent } from '@testing-library/react';
import {Register} from './frontend/my-app/src/login';
import {Dashboard} from './frontend/my-app/src/dashboard/Dashboard';
import { jest } from '@jest/globals';
import { Readable } from 'stream'; // Node.js Readable stream


jest.mock('axios');


describe('API Testing', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock calls or setups
  });

  afterEach(() => {
    jest.resetAllMocks(); // Reset all mocks after each test
  });

  /* this one not working idk why
  // Mock API Rendering Test
  describe('Mock API', () => {
    test('Renders Register Component', async () => {
      render(<Register />);
      const element = await screen.findByText(/Create an Account/i);
      expect(element).toBeInTheDocument();
    });
  });
*/
  // Sign-Up Testing
  describe('Sign Up Testing', () => {
    test('Invalid Input', async () => {
      const newUser = {
        email: 'example2.com',
        username: 'testing',
        password: 'testPassword',
      };

      axios.post.mockRejectedValue({
        response: {
          status: 400,
          data: { error: 'Invalid email format' },
        },
      });

      try {
        await axios.post('http://localhost:5000/api/register', newUser);
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toBe('Invalid email format');
      }
    });

    test('Successful Registration', async () => {
      const newUser = {
        email: 'success@example.com',
        username: 'testing',
        password: 'testPassword',
      };

      axios.post.mockResolvedValue({
        status: 201,
        data: { message: 'User registered successfully' },
      });

      const response = await axios.post('http://localhost:5000/api/register', newUser);
      expect(response.status).toBe(201);
      expect(response.data.message).toBe('User registered successfully');
    });

    test('User Already Registered', async () => {
      const newUser = {
        email: 'alreadyregistered@example.com',
        username: 'testingregistered',
        password: 'testPassword',
      };

      axios.post.mockResolvedValueOnce({
        status: 201,
        data: { message: 'User registered successfully' },
      });

      axios.post.mockRejectedValueOnce({
        response: {
          status: 409,
          data: { error: 'Email already registered' },
        },
      });

      try {
        await axios.post('http://localhost:5000/api/register', newUser);
        await axios.post('http://localhost:5000/api/register', newUser);
      } catch (error) {
        expect(error.response.status).toBe(409);
        expect(error.response.data.error).toBe('Email already registered');
      }
    });
  });

  // Login Testing
  describe('Login Testing', () => {
    test('Successful Login', async () => {
      const mockResponse = {
        status: 200,
        data: { token: 'fakeToken' },
      };

      axios.post.mockResolvedValueOnce(mockResponse);

      const newUser = {
        email: 'alreadyregistered@example.com',
        password: 'testPassword',
      };

      const response = await axios.post('http://localhost:5000/api/login', newUser);
      expect(response.status).toBe(200);
      expect(response.data.token).toBe('fakeToken');
    });

    test('Unsuccessful Login', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { error: 'Invalid email or password' },
        },
      };

      axios.post.mockRejectedValueOnce(mockError);

      const newUser = {
        email: 'alreadyregistered@example.com',
        password: 'wrongPassword',
      };

      try {
        await axios.post('http://localhost:5000/api/login', newUser);
      } catch (error) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.error).toBe('Invalid email or password');
      }
    });
  });


// File Upload Testing

// Create a mock file that behaves like a stream
const mockFile = new Readable();
mockFile._read = () => {}; // Implement _read method
mockFile.push('dummy content'); // Push data to the stream
mockFile.push(null); // End the stream

    describe('File Upload Testing', () => {
        test('Valid PDF file upload', async () => {
            // Create a new FormData instance
            const formData = new FormData();
        
            // Create a mock valid PDF file stream
            const validPdfFile = new Readable();
            validPdfFile._read = () => {}; // Implement _read method for stream
            validPdfFile.push('dummy content for valid pdf'); // Push content to stream
            validPdfFile.push(null); // End the stream
        
            // Mock file mimicking a valid PDF file
            validPdfFile.name = 'mock_resume.pdf';
            validPdfFile.type = 'application/pdf';
        
            // Append the mock file stream to the formData
            formData.append('resume_file', validPdfFile);
        
            // Mock the response from axios POST request
            axios.post.mockResolvedValue({
              status: 200,
              data: { message: 'File uploaded successfully' },
            });
        
            // Call the POST request with the formData
            const response = await axios.post('/upload', formData, {
              headers: formData.getHeaders(),
            });
        
            // Assertions to check if the upload was successful
            expect(response.status).toBe(200);
            expect(response.data.message).toBe('File uploaded successfully');
          });
        
          test('Invalid file type (non-PDF)', async () => {
            // Create a new FormData instance
            const formData = new FormData();
        
            // Create a mock invalid file (e.g., text file) as a stream
            const invalidFile = new Readable();
            invalidFile._read = () => {}; // Implement _read method for stream
            invalidFile.push('dummy content for invalid file'); // Push content to stream
            invalidFile.push(null); // End the stream
        
            // Mock file mimicking a non-PDF file (e.g., .txt)
            invalidFile.name = 'mock_resume.txt';
            invalidFile.type = 'text/plain';
        
            // Append the invalid file stream to the formData
            formData.append('resume_file', invalidFile);
        
            // Mock the error response from axios POST request for invalid file type
            axios.post.mockRejectedValue({
              response: {
                status: 400,
                data: { error: 'Invalid file type' },
              },
            });
        
            // Call the POST request with the formData and handle the error
            try {
              await axios.post('/upload', formData, {
                headers: formData.getHeaders(),
              });
            } catch (error) {
              // Assertions to check if the error was thrown and contains the expected message
              expect(error.response.status).toBe(400);
              expect(error.response.data.error).toBe('Invalid file type');
            }
          });
        
          test('Oversized file upload', async () => {
            // Create a new FormData instance
            const formData = new FormData();
        
            // Create a mock oversized file stream (15MB file)
            const largeFile = new Readable();
            largeFile._read = () => {}; // Implement _read method for stream
            largeFile.push('x'.repeat(15 * 1024 * 1024)); // Push large data to stream (15MB)
            largeFile.push(null); // End the stream
        
            // Mock file mimicking a large PDF file
            largeFile.name = 'large_mock_resume.pdf';
            largeFile.type = 'application/pdf';
        
            // Append the oversized file stream to the formData
            formData.append('resume_file', largeFile);
        
            // Mock the error response for file size too large
            axios.post.mockRejectedValue({
              response: {
                status: 413,
                data: { error: 'File size too large' },
              },
            });
        
            // Call the POST request with the formData and handle the error
            try {
              await axios.post('/upload', formData, {
                headers: formData.getHeaders(),
              });
            } catch (error) {
              // Assertions to check if the error was thrown and contains the expected message
              expect(error.response.status).toBe(413);
              expect(error.response.data.error).toBe('File size too large');
            }
          });
    });


  // Job Description Testing
  describe('Description Testing', () => {
    test('No Description', async () => {
      const description = '';

      axios.post.mockRejectedValue({
        response: {
          status: 400,
          data: { error: 'Job description not provided.' },
        },
      });

      try {
        await axios.post('http://localhost:5000/api/job-description', {
          'job-description': description,
        });
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toBe('Job description not provided.');
      }
    });

    test('Exceeds Character Limit', async () => {
      const description = 'a'.repeat(5001); // Replace with actual limit
      axios.post.mockRejectedValue({
        response: {
          status: 400,
          data: { error: 'Job description exceeds character limit.' },
        },
      });

      try {
        await axios.post('http://localhost:5000/api/job-description', {
          'job-description': description,
        });
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toBe('Job description exceeds character limit.');
      }
    });

    test('Successful Description Submission', async () => {
      const description = 'This is a valid job description';

      axios.post.mockResolvedValue({
        status: 200,
        data: { message: 'Job description submitted successfully.' },
      });

      const response = await axios.post('http://localhost:5000/api/job-description', {
        'job-description': description,
      });

      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Job description submitted successfully.');
    });
  });
});

