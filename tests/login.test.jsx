import axios from 'axios';
const FormData = require('form-data');
const fs = require('fs');
const PDFDocument = require('pdfkit');
import { jest } from '@jest/globals';
import { Readable } from 'stream';
jest.mock('axios');
const { jsPDF } = require("jspdf");


describe('API Testing', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  afterEach(() => {
    jest.resetAllMocks(); 
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

  /*can be done with rendering but I cant figure that out
  describe('Session Handling', () => {
    test("Cannot Access Protected Dashboard without Logging In", () => {

    });
  });
  */

  // File Upload Testing - Create a mock file that behaves like a stream
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

  describe('Scores, Feedback, and Matched Keywords', () => {
    test('Successful Returns', async() => {
      const resumeContent = `
      John Doe's Resume
        Email: john.doe@email.com
        Phone: (555) 555-5555
        LinkedIn: linkedin.com/in/johndoe
        Experience
        Software Engineer | ABC Tech | Jan 2020 - Present
        - Developed and maintained web applications using React and Node.js.
        - Collaborated with teams to implement features and fix bugs.
        - Wrote unit and integration tests to ensure quality code.
        Junior Developer | XYZ Corp | June 2018 - Dec 2019
        - Assisted with building and optimizing web applications.
        - Maintained front-end and back-end code for various internal tools.
        - Contributed to debugging and resolving technical issues.
        Education
        Bachelor of Science in Computer Science | University of Example | 2018
        - Focused on software development, algorithms, and data structures.
        Skills
        - JavaScript (React, Node.js, Express)
        - Python (Flask, Django)
        - HTML, CSS, SQL
        - Git, Agile Development, Unit Testing
      `;

      const description = `
      We are looking for a skilled and motivated Software Engineer to join our dynamic engineering team. In this role, you will be responsible for designing, developing, and maintaining web and mobile applications. You will collaborate with cross-functional teams to deliver high-quality software solutions and contribute to various stages of the software development lifecycle.

      Responsibilities:

      Design and develop high-quality web and mobile applications.
      Write clean, maintainable, and efficient code.
      Collaborate with product managers, designers, and other engineers to deliver robust software solutions.
      Troubleshoot, debug, and optimize code to improve performance.
      Implement new features and enhance existing functionalities.
      Write unit and integration tests to ensure code quality and reliability.
      Participate in code reviews and contribute to team best practices.
      Stay up to date with the latest software development trends, tools, and technologies.
      Requirements:

      Bachelor's degree in Computer Science, Engineering, or related field (or equivalent practical experience).
      2+ years of experience in software development (web or mobile).
      Proficiency in JavaScript (React, Node.js), Python, or similar technologies.
      Strong understanding of algorithms, data structures, and software design principles.
      Experience with version control systems (e.g., Git).
      Excellent problem-solving and debugging skills.
      Strong communication skills and the ability to work well in a team.
      Experience with Agile development methodologies is a plus.`;

      axios.post.mockResolvedValue({
        status: 200,
        data: {
          message: "Submitted successfully.",
          fit_score: 85,
          feedback: [
            "Include experience with AWS services.",
            "Add projects demonstrating REST API development."
          ], 
          matched_keywords: ["Python", "REST APIs", "AWS"]
        }
      });
      const response = await axios.post('http://localhost:5000/api/fit-score', {
        "resume_text": resumeContent,
        "job_description": description
      });
      expect(response.status).toBe(200);
      expect(response.data.message).toBe("Submitted successfully.");
      expect(response.data.fit_score).toBe(85);
      expect(response.data.feedback).toEqual([
        "Include experience with AWS services.",
        "Add projects demonstrating REST API development."
      ]); 
      expect(response.data.matched_keywords).toEqual(["Python", "REST APIs", "AWS"]);
    })
  });
});


/*
TO DO:

Dominic:
  From Sprint 1 uncompleted:
  - test text extractions
  - Test data insertion and retrieval in memory

Eric:
  From Sprint 1 uncompleted:
  - Verify that restricted routes enforce login / navigation
  - Test that the loading spinner appears during API requests.
  
*/
