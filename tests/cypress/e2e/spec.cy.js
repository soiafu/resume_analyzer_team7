describe('Basic Webpage Accessibility Test', () => {
  it('Should load the website at http://localhost:3000', () => {
    cy.visit('http://localhost:3000');
    cy.get('body').should('be.visible');
  });
});

describe('Sign Up Test', () => {
  //did not actually make a valid account since it will not pass tests after run once
  it('Account Already Created', () => {
    cy.visit('http://localhost:3000/login'); 
    cy.get('input[placeholder="Enter email"]').type('testvalidemail@gmail.com'); 
    cy.get('input[placeholder="Enter username"]').type('testvalidemail'); 
    cy.get('input[placeholder="Enter password"]').type('Password123!'); 
    cy.get('input[placeholder="Re-enter password"]').type('Password123!'); 
    cy.get('button[type="submit"]').contains('Sign Up').click();
    cy.contains('Email already registered').should('be.visible');
  });

  it('Password and Confirm Password do not match', () => {
    cy.visit('http://localhost:3000/login'); 
    cy.get('input[placeholder="Enter email"]').type('email@gmail.com'); 
    cy.get('input[placeholder="Enter username"]').type('testvalidemail'); 
    cy.get('input[placeholder="Enter password"]').type('Password123!'); 
    cy.get('input[placeholder="Re-enter password"]').type('Password'); 
    cy.get('button[type="submit"]').contains('Sign Up').click();
    cy.contains('Passwords do not match').should('be.visible');
  });

  it('Invalid Email Format', () => {
    cy.visit('http://localhost:3000/login'); 
    cy.get('input[placeholder="Enter email"]').type('email'); 
    cy.get('input[placeholder="Enter username"]').type('testemail'); 
    cy.get('input[placeholder="Enter password"]').type('Password123!'); 
    cy.get('input[placeholder="Re-enter password"]').type('Password123!'); 
    cy.get('button[type="submit"]').contains('Sign Up').click();
    cy.contains('Invalid email format').should('be.visible');
  });

  it('Blank Inputs', () => {
    cy.visit('http://localhost:3000/login'); 
    cy.get('input[placeholder="Enter email"]').type('email@gmail.com'); 
    cy.get('button[type="submit"]').contains('Sign Up').click();
    cy.contains('Please fill required fields').should('be.visible');
  });

});

describe('Log In Test', () => {
  it('Invalid email', () => {
    cy.visit('http://localhost:3000/login'); 
    cy.get('input[placeholder="Enter your email"]').type('testvalidemail'); 
    cy.get('input[placeholder="Enter your password"]').type('Password123!'); 
    cy.get('button[type="submit"]').contains('Login').click();
    cy.contains('Invalid email.').should('be.visible');
  });

  it('Invalid password', () => {
    cy.visit('http://localhost:3000/login'); 
    cy.get('input[placeholder="Enter your email"]').type('testvalidemail@gmail.com'); 
    cy.get('input[placeholder="Enter your password"]').type('wrongPassword'); 
    cy.get('button[type="submit"]').contains('Login').click();
    cy.contains('Invalid email or password').should('be.visible');
  });

  it('Should successfully log in a user', () => {
    cy.visit('http://localhost:3000/login'); 
    cy.get('input[placeholder="Enter your email"]').type('testvalidemail@gmail.com'); 
    cy.get('input[placeholder="Enter your password"]').type('Password123!'); 
    cy.get('button[type="submit"]').contains('Login').click();
    cy.url().should('include', '/dashboard'); // Change to the correct URL after successful sign-up
  });
});

describe('Invalid Inputs', () => {
  it('No Resume & Description Upload - "Get My Results!"', () => {
    cy.visit('http://localhost:3000/dashboard'); 
    cy.get('button[type="submit"]').contains('Get My Results!').click();
    cy.contains('Invalid input data. Both resume and job description are required.').should('be.visible');
  });

  it('No Resume & Description Upload - "Download PDF Report"', () => {
    cy.visit('http://localhost:3000/dashboard'); 
    cy.get('button').contains('Download PDF Report').click();
    cy.contains('Must Get Results Before Downloading').should('be.visible');
  });

  it('No Resume Upload', () => {
    cy.visit('http://localhost:3000/dashboard'); 
    cy.get('button[type="submit"]').contains('Upload').click();
    cy.contains('File not found').should('be.visible');
  });

  it('Invalid File Type Uploaded', () => {
    const filePath = 'fail.txt';
    cy.visit('http://localhost:3000/dashboard'); 
    cy.get('input[type="file"]').attachFile(filePath);
    cy.get('button[type="submit"]').contains('Upload').click();
    cy.contains('Invalid file type. Only PDF files are allowed.').should('be.visible');
  });

  it('Tries to generate an empty PDF', () => {
    cy.visit('http://localhost:3000/dashboard'); 
    cy.get('button[type="submit"]').contains('Generate PDF').click();
    cy.contains('File not found').should('be.visible');
  });

  it('No Job Description', () => {
    cy.visit('http://localhost:3000/dashboard'); 
    cy.get('button[type="submit"]').contains('Submit').click();
    cy.contains('Job description not provided.').should('be.visible');
  });
  /*
  it('Long Description', () => {
    cy.visit('http://localhost:3000/dashboard'); 
    const description = `
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    `;

    //can we have it copy and paste?
    cy.get('textarea[placeholder="Paste the job description here..."]',)
      .type(description, {  parseSpecialCharSequences: false});


    cy.get('button[type="submit"]').contains('Submit').click();
    cy.contains('Job description exceeds character limit.').should('be.visible');
  });
  */
});

describe('Successful Inputs', () => {
  /*
  it('Successful Resume File Pasted', () => {
    cy.visit('http://localhost:3000/dashboard'); 
    const resume = `demo resume`;
    cy.get('textarea[placeholder="Paste the resume here..."]',)
      .type(resume, {  parseSpecialCharSequences: false});
    cy.get('button[type="submit"]').contains('Generate PDF').click();
    cy.contains('Resume uploaded successfully.').should('be.visible');
  });
*/
  it('Successful Resume File Upload', () => {
    const filePath = 'test.pdf';
    cy.visit('http://localhost:3000/dashboard'); 
    cy.get('input[type="file"]').attachFile(filePath);
    cy.get('button[type="submit"]').contains('Upload').click();
    cy.contains('Resume uploaded successfully.').should('be.visible');
  });

  it('Successful Description Upload', () => {
    cy.visit('http://localhost:3000/dashboard'); 
    const description = `demo job description`;
    cy.get('textarea[placeholder="Paste the job description here..."]',)
      .type(description, {  parseSpecialCharSequences: false});
    cy.get('button[type="submit"]').contains('Submit').click();
    cy.contains('Job description submitted successfully.').should('be.visible');
  });

});

``

describe('Fit Score Test', () => {
  it('Fit Score 0', () => {
    cy.intercept('POST', 'http://localhost:5000/api/analyze', {
      statusCode: 200,
      body: {
        message: '',
        fit_score: 0,
        feedback: ['sample'],
        missing_keywords: ['sample'],
        suggestions: ['sample'],
        matched_keywords: ['sample'],
      },
    }).as('analyzeAPI');
    cy.visit('http://localhost:3000/dashboard');
    cy.get('button[type="submit"]').contains('Get My Results!').click();
    cy.contains('0%').should('be.visible');
  });

  it('Fit Score 50', () => {
    cy.intercept('POST', 'http://localhost:5000/api/analyze', {
      statusCode: 200,
      body: {
        message: '',
        fit_score: 50,
        feedback: ['sample'],
        missing_keywords: ['sample'],
        suggestions: ['sample'],
        matched_keywords: ['sample'],
      },
    }).as('analyzeAPI');
    cy.visit('http://localhost:3000/dashboard');
    cy.get('button[type="submit"]').contains('Get My Results!').click();
    cy.contains('50%').should('be.visible');
  });

  it('Fit Score 100', () => {
    cy.intercept('POST', 'http://localhost:5000/api/analyze', {
      statusCode: 200,
      body: {
        message: '',
        fit_score: 100,
        feedback: ['sample'],
        missing_keywords: ['sample'],
        suggestions: ['sample'],
        matched_keywords: ['sample'],
      },
    }).as('analyzeAPI');
    cy.visit('http://localhost:3000/dashboard');
    cy.get('button[type="submit"]').contains('Get My Results!').click();
    cy.contains('100%').should('be.visible');
  });
});

describe('API Integration', () => {
  it('handles API data correctly', () => {
    cy.intercept('POST', 'http://localhost:5000/api/analyze', {
      statusCode: 200,
      body: {
        message: 'Submitted successfully.',
        fit_score: 75,
        feedback: ['Feedback 1', 'Feedback 2'],
        missing_keywords: ['Keyword 1'],
        suggestions: ['Suggestion 1', 'Suggestion 2'],
        matched_keywords: ['Keyword 2'],
      },
    }).as('analyzeAPI');
    cy.visit('http://localhost:3000/dashboard');
    cy.get('button[type="submit"]').contains('Get My Results!').click();
    cy.contains('75%').should('be.visible'); // Verify fit score is displayed
    cy.contains('Keyword 2').should('be.visible'); // Verify feedback is displayed
    cy.contains('Keyword 1').should('be.visible');
    cy.contains('Suggestion 1').should('be.visible'); // Verify suggestions are displayed
    cy.contains('Suggestion 2').should('be.visible');
  });
});
describe('Filtering Feedback', () => {
  beforeEach(() => {
    cy.intercept('POST', 'http://localhost:5000/api/analyze', {
      statusCode: 200,
      body: {
        message: 'Feedback submitted successfully.',
        fit_score: 80,
        feedback: ['keyword'],
        missing_keywords: ['Keyword 1'],
        suggestions: ["Include experience with AWS services.", "Add projects demonstrating REST API development.", "Ensure consistent formatting across sections."],
        matched_keywords: ['Keyword 2'],
      },
    }).as('analyzeAPI');
  });

  it('filters feedback based on the selected category', () => {
    cy.visit('http://localhost:3000/dashboard');
    cy.get('button[type="submit"]').contains('Get My Results!').click();
    cy.wait('@analyzeAPI');

    cy.contains('Include experience with AWS services.').should('be.visible');
    cy.contains('Add projects demonstrating REST API development.').should('be.visible');
    cy.contains('Ensure consistent formatting across sections.').should('be.visible');

    cy.get('select').select('Skills');
    cy.contains('Include experience with AWS services.').should('be.visible');

    cy.get('select').select('Experience');
    cy.contains('Add projects demonstrating REST API development.').should('be.visible');

    cy.get('select').select('Formatting');
    cy.contains('Ensure consistent formatting across sections.').should('be.visible');
  });
});

describe('Edge Cases', () => {
  it('no fit score', () => {
    cy.intercept('POST', 'http://localhost:5000/api/analyze', {
      statusCode: 200,
      body: {
        message: 'Submitted successfully.',
        feedback: ['Feedback 1', 'Feedback 2'],
        missing_keywords: ['Keyword 1'],
        suggestions: ['Suggestion 1', 'Suggestion 2'],
        matched_keywords: ['Keyword 2'],
      },
    }).as('analyzeAPI');
    cy.visit('http://localhost:3000/dashboard');
    cy.get('button[type="submit"]').contains('Get My Results!').click();
    cy.contains('undefined%').should('be.visible');
  });
  it('no suggestion array', () => {
    cy.intercept('POST', 'http://localhost:5000/api/analyze', {
      statusCode: 200,
      body: {
        message: 'Submitted successfully.',
        fit_score: 80,
        feedback: [],
        missing_keywords: ['Keyword 1'],
        suggestions: [],
        matched_keywords: ['Keyword 2'],
      },
    }).as('analyzeAPI');
    cy.visit('http://localhost:3000/dashboard');
    cy.get('button[type="submit"]').contains('Get My Results!').click();
    cy.contains('No suggestions available for the selected category.').should('be.visible');
  });
});

describe('End to End', () => {
  it('Successful End to End', { timeout: 50000 }, () => {
    const filePath = 'test.pdf';
    cy.visit('http://localhost:3000/dashboard'); 
    cy.get('input[type="file"]').attachFile(filePath);
    cy.get('button[type="submit"]').contains('Upload').click();
    cy.contains('Resume uploaded successfully.').should('be.visible');

    const description = `
      We are looking for a skilled and motivated Software Engineer to join our dynamic engineering team. In this role, you will be responsible for designing, developing, and maintaining web and mobile applications. You will collaborate with cross-functional teams to deliver high-quality software solutions and contribute to various stages of the software development lifecycle.
      Responsibilities:
      Design and develop high-quality web and mobile applications.
      Write clean, maintainable, and efficient code.
      Collaborate with product managers, designers, and other engineers to deliver robust software solutions.
      Troubleshoot, debug, and optimize code to improve performance.

      Requirements:
      Bachelor's degree in Computer Science, Engineering, or related field (or equivalent practical experience).
      2+ years of experience in software development (web or mobile).
      Proficiency in JavaScript (React, Node.js), Python, or similar technologies.
      Strong understanding of algorithms, data structures, and software design principles.
      Experience with version control systems (e.g., Git).
      Excellent problem-solving and debugging skills.
      Strong communication skills and the ability to work well in a team.
      Experience with Agile development methodologies is a plus.`;

    cy.get('textarea[placeholder="Paste the job description here..."]',)
      .type(description, {  parseSpecialCharSequences: false});
    cy.get('button[type="submit"]').contains('Submit').click();
    cy.contains('Job description submitted successfully.').should('be.visible');
    cy.get('button[type="submit"]').contains('Get My Results!').click();
    cy.contains('Submitted successfully.').should('be.visible');
    cy.contains('Matched Keywords').should('be.visible');
    cy.contains('Missing Keywords').should('be.visible');
    cy.get('button').contains('Download PDF Report').click();
  });
});


