
## Setup Instructions

**Clone the Repository**
<pre> git clone https://github.com/soiafu/resume_analyzer_team7 
 cd resume_analyzer_team7 </pre>


**Install Dependencies**  
Make sure you have Node.js installed. Then run:
<pre> npm install </pre>
This will install all the required packages.

**Set Up Environment Variables**  
Create a .env file in the root directory and configure any required environment variables. Contact Sofia Usmani (su22@njit.edu) for credentials. 

**Run the Development Server**  
First, go to the backend directory: 
<pre> cd backend </pre>
Install the required packages:
<pre> npm install </pre>
Run the backend server from the terminal: 
<pre> node index.js </pre>
The server will run at http://localhost:5000.

Next, open a new terminal then go to the frontend directory: 
<pre> cd resume_analyer_team7\frontend\my-app </pre> 
Install the required packages:
<pre> npm install </pre>
Start the React development server with:
<pre> npm start </pre>
The app will run at http://localhost:3000 by default.

**Run Tests** (optional)  
Open a new terminal and navigate to the tests directory: 
<pre> cd resume_analyzer_team7\tests </pre>

You can run the backend tests using:
<pre> npm test </pre>  

You can run the frontend end-to-end tests using Cypress:
<pre> npx cypress open </pre>  
Once Cypress is opened, click on "E2E Testing".
After choosing your preferred browser, click "Start E2E Testing".
Next, Click on "spec.cy.js". 
The tests will run.

### **Troubleshooting**
If npm start does not work and there are missing packages, install these:  
<pre> npm install react-scripts </pre>  




