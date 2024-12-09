describe('Basic Webpage Accessibility Test', () => {
  it('Should load the website at http://localhost:3000', () => {
    cy.visit('http://localhost:3000');
    cy.get('body').should('be.visible');
  });
});

describe('Sign Up', () => {
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
  it('No Resume or Description Upload', () => {
    cy.visit('http://localhost:3000/dashboard'); 
    cy.get('button[type="submit"]').contains('Get My Results!').click();
    cy.contains('Invalid input data. Both resume and job description are required.').should('be.visible');
  });

  it('No Resume Upload', () => {
    cy.visit('http://localhost:3000/dashboard'); 
    cy.get('button[type="submit"]').contains('Upload').click();
    cy.contains('File not found').should('be.visible');
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
  
});


describe('Uploading Resume Test', () => {
  it('Invalid File Type Uploaded', () => {
    const filePath = 'fail.txt';
    cy.visit('http://localhost:3000/dashboard'); 
    cy.get('input[type="file"]').attachFile(filePath);
    cy.get('button[type="submit"]').contains('Upload').click();
    cy.contains('Invalid file type. Only PDF files are allowed.').should('be.visible');
  });

  it('Valid PDF Uploaded', () => {
    const filePath = 'test.pdf';
    cy.visit('http://localhost:3000/dashboard'); 
    cy.get('input[type="file"]').attachFile(filePath);
    cy.get('button[type="submit"]').contains('Upload').click();
    cy.contains('Resume uploaded successfully.').should('be.visible');
  });


});

describe('Uploading Description Test', () => {
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

  it('Valid Job Description', () => {
    cy.visit('http://localhost:3000/dashboard'); 
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

    cy.get('textarea[placeholder="Paste the job description here..."]',)
      .type(description, {  parseSpecialCharSequences: false});
    cy.get('button[type="submit"]').contains('Submit').click();
    cy.contains('Job description submitted successfully.').should('be.visible');
  });

}); 
