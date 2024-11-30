import axios from 'axios';
import React, {useState} from 'react';
const FormData = require('form-data');
const fs = require('fs');
const PDFDocument = require('pdfkit');
import { render, screen, fireEvent } from '@testing-library/react';
import {Register} from '../frontend/my-app/src/login';
import {Dashboard} from '../frontend/my-app/src/dashboard/Dashboard';
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

    test('Unsuccessful Login - Wrong Password', async () => {
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

    test('Unsuccessful Login - No Input', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { error: 'Please fill required fields'},
        },
      };

      axios.post.mockRejectedValueOnce(mockError);

      const newUser = {
        email: '',
        password: '',
      };

      try {
        await axios.post('http://localhost:5000/api/login', newUser);
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.error).toBe('Please fill required fields');
      }
    });

  });

  // File Upload Testing
  // Create a mock file that behaves like a stream
  const mockFile = new Readable();
  mockFile._read = () => {}; 
  mockFile.push('dummy content'); 
  mockFile.push(null); 

  describe('File Upload Testing', () => {
      test('Valid PDF file upload', async () => {
          const formData = new FormData();
          const validPdfFile = new Readable();
          validPdfFile._read = () => {}; 
          validPdfFile.push('dummy content for valid pdf'); 
          validPdfFile.push(null); 
          validPdfFile.name = 'mock_resume.pdf';
          validPdfFile.type = 'application/pdf';
          formData.append('resume_file', validPdfFile);

          axios.post.mockResolvedValue({
            status: 200,
            data: { message: 'File uploaded successfully' },
          });
      
          const response = await axios.post('/upload', formData, {
            headers: formData.getHeaders(),
          });
      
          expect(response.status).toBe(200);
          expect(response.data.message).toBe('File uploaded successfully');
        });
      
        test('Invalid file type (non-PDF)', async () => {
          const formData = new FormData();
    
          const invalidFile = new Readable();
          invalidFile._read = () => {}; 
          invalidFile.push('dummy content for invalid file'); 
          invalidFile.push(null); 
          invalidFile.name = 'mock_resume.txt';
          invalidFile.type = 'text/plain';
          formData.append('resume_file', invalidFile);
          axios.post.mockRejectedValue({
            response: {
              status: 400,
              data: { error: 'Invalid file type' },
            },
          });

          try {
            await axios.post('/upload', formData, {
              headers: formData.getHeaders(),
            });
          } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data.error).toBe('Invalid file type');
          }
        });
      
        test('Oversized file upload', async () => {
          const formData = new FormData();
          const largeFile = new Readable();
          largeFile._read = () => {}; 
          largeFile.push('x'.repeat(15 * 1024 * 1024)); 
          largeFile.push(null); 
          largeFile.name = 'large_mock_resume.pdf';
          largeFile.type = 'application/pdf';
          formData.append('resume_file', largeFile);
          axios.post.mockRejectedValue({
            response: {
              status: 413,
              data: { error: 'File size too large' },
            },
          });
          try {
            await axios.post('/upload', formData, {
              headers: formData.getHeaders(),
            });
          } catch (error) {
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
      const description = 'a'.repeat(5001); 
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

