import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from './dashboardStyles';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { CircularProgressbar } from 'react-circular-progressbar';
import { TailSpin } from "react-loader-spinner";
import backgroundImg from '../background3.png';
import { jwtDecode } from 'jwt-decode';
import { jsPDF } from "jspdf";

//protect dashboard route
const checkTokenExpiration = () => {
  const token = localStorage.getItem('authToken');
  if(token==null){
    handleTokenNull();
  }
  else if (token) {
    const decoded = jwtDecode(token);
    const expirationTime = decoded.exp * 1000; 
    const currentTime = Date.now();

    const timeRemaining = expirationTime - currentTime;

    if (timeRemaining <= 0) {
      handleTokenExpired();
    } else {
      setTimeout(() => {
        checkTokenExpiration();
      }, Math.min(timeRemaining, 60000)); 
    }
  }
};

const handleTokenNull = () => {
  alert('Please log in to view this protected page.');
  console.log('Can not view protected page. Going back to login...');
  localStorage.removeItem('authToken');
  window.location.href = '/login';
};

const handleTokenExpired = () => {
  alert('Your token has expired. Please log in again.');
  console.log('Token expired. Logging out...');
  localStorage.removeItem('authToken');
  window.location.href = '/login';
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken'); 
  window.onload = () => {
    checkTokenExpiration();
  };
  console.log('the token is ', token);
  return children;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [pdf, setPDF] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [descLoading, setDescLoading] = useState(false);
  const [resumeContent, setResumeContent] = useState('');

  //uploading the resume
  const handleUpload = async (e) => {
    e.preventDefault();
    setPDF(null);
    setError('');
    setSuccess('');
    try {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append('resume_file', pdf); 
      const postResponse = await axios.post('http://localhost:5000/api/resume-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      setUploadLoading(false);
      console.log("response is: ", postResponse.data.text)
      setResumeContent(postResponse.data.text);
      setSuccess(postResponse.data.message);
    } 

    catch (err) {
      if (err.response) {
        setUploadLoading(false);
        console.log('Error: ', err.response.data.error);
        setError(err.response.data.error);
      } 
      else if (err.request) {
        setUploadLoading(false);
        setError('No response from server. Please try again later.');
      } else {
        setUploadLoading(false);
        setError('Error occurred while making the request.');
      }

    } 

  }

  //uploading the description
  const [description, setDescription] = useState('');
  const [succ, setSucc] = useState('');
  const [err, setErr] = useState('');

  const handleDescription = async (e) => {
    e.preventDefault();
    setErr('');
    setSucc('');
    try {
      setDescLoading(true);

      const postResponse = await axios.post('http://localhost:5000/api/job-description', {
        "job-description": description
      });
      setDescLoading(false);
      setSucc(postResponse.data.message)
    } 

    catch (err) {
      if (err.response) {
        setDescLoading(false);
        console.log('Backend error message:', err.response.data.message);
        setErr(err.response.data.error);
      } 
      else if (err.request) {
        setDescLoading(false);
        setErr('No response from server. Please try again later.');
      } else {
        setDescLoading(false);
        setErr('Error occurred while making the request.');
      }
    } 
  }

  //letter counter for description
  const [wordCount, setWordCount] = useState(0);
  const wordCounter = (event) => {
    setWordCount(0);
    const text = event.target.value;
    const count = text.replace(/\s/g, '').length;
    setWordCount(count);
  }

  const [letterCount, setLetterCount] = useState(0);
  const letterCounter = (event) => {
    setLetterCount(0);
    const text = event.target.value;
    const count = text.replace(/\s/g, '').length;
    setLetterCount(count);
  }

// if user pastes resume
function makePDF(text) {
    if (text==''){
      return('');
    }
    const doc = new jsPDF(); 
    doc.text(text, 10, 10);
    const pdfBlob = doc.output("blob");
    setPDF(pdfBlob); 
    console.log("PDF generated and stored in state.");
    return(pdfBlob);
}

const [pdfError, setPdfError] = useState('');

//for user to download the resume
function generatePDF(fitScore, missingSkills, matchedSkills, feedback) {
  console.log("this is the feedback:", feedback)
  setPdfError('')
  if(fitScore==('') || missingSkills==('') || feedback==('')){
    setPdfError('Must Get Results Before Downloading')
    return
  }

  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Resume Analysis Report", 105, 20, { align: "center" });
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(`Fit Score: ${fitScore}%`, 10, 40);

  // Matched Skills section
  doc.setFillColor(200, 200, 200);
  doc.rect(10, 50, 190, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Matched Skills and Keywords:", 10, 57);
  doc.setFont("helvetica", "normal");
  let matchedSkillsStartY = 65;
  matchedSkills.forEach((keyword, index) => {
    doc.text(`- ${keyword}`, 15, matchedSkillsStartY + index * 10);
  });

  // Missing Skills section
  const missingSkillsStartY = matchedSkillsStartY + matchedSkills.length * 10 + 10;
  doc.setFillColor(200, 200, 200);
  doc.rect(10, missingSkillsStartY - 7, 190, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Missing Skills and Keywords:", 10, missingSkillsStartY);
  doc.setFont("helvetica", "normal");
  missingSkills.forEach((keyword, index) => {
    doc.text(`- ${keyword}`, 15, missingSkillsStartY + 10 + index * 10);
  });

  // Feedback section
  const feedbackStartY = missingSkillsStartY + missingSkills.length * 10 + 10;
  doc.setFillColor(200, 200, 200);
  doc.rect(10, feedbackStartY - 7, 190, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Feedback:", 10, feedbackStartY);
  doc.setFont("helvetica", "normal");

  const maxWidth = 180; 
  let y = feedbackStartY + 10; 
  const lineHeight = 10; 
  const pageHeight = 280; 

  feedback.forEach((item) => {
      const lines = doc.splitTextToSize(`${item}`, maxWidth); 
      
      lines.forEach((line) => {
          if (y + lineHeight > pageHeight) {
              doc.addPage(); 
              y = 10; 
          }
          doc.text(line, 15, y); 
          y += lineHeight; 
      });
  });
  
  doc.setFontSize(10);
  doc.text("Page 1", 105, 290, { align: "center" });
  doc.save("Resume_Analysis_Report.pdf");
}



const [er, setE] = useState('');
const [s, setS] = useState('');
const [resInput, setInput] = useState('');
const [fitScore, setScore] = useState('');
const [missingSkills, setMissingSkills] = useState('');
const [matchedSkills, setMatchedSkills] = useState('');
const [suggestions, setSuggestions] = useState(['', '', '']);
const [filter, setFilter] = useState("all");
const [feedback, setFeedback] = useState();
const [resultsLoading, setResultsLoading] = useState(false);

const getFitScore = async (e) => {
  e.preventDefault();
  setS('');
  setE('');
  setScore('');
  
  try {
    setResultsLoading(true);
    const postResponse = await axios.post('http://localhost:5000/api/analyze', {
        "resume_text": resumeContent,
        "job_description": description
    });
    
    setS(postResponse.data.message);
    setScore(postResponse.data.fit_score);
    setFeedback(postResponse.data.feedback);
    setSuggestions(postResponse.data.suggestions);
    setMissingSkills(postResponse.data.missing_keywords);
    setMatchedSkills(postResponse.data.matched_keywords);
    setResultsLoading(false);
  } 

  catch (err) {
    setResultsLoading(false);
    if (err.response) {
      setDescLoading(false);
      console.log('Backend error message:', err.response.data.message);
      setE(err.response.data.error);
    } 
  }
}

const filteredSuggestions = (() => {
  if (filter === "All") {
    return suggestions;  // Show all suggestions if "all" is selected
  }
  if (filter === "Skills") {
    console.log("The feedback is: ", suggestions[0]);
    return [suggestions[0]];  // Show only the first suggestion for "skills"
  }
  if (filter === "Experience") {
    return [suggestions[1]];  // Show only the second suggestion for "experience"
  }
  if (filter === "Formatting") {
    return [suggestions[2]];  // Show only the third suggestion for "formatting"
  }
  return suggestions;  // Default to empty if no valid filter is selected
})();

  return(
  <div style={styles.background}>
    <div style={styles.container}>
      <div style={styles.leftContainer}>
        <div style={styles.containerResume}>
          <h1 style={styles.title}>Upload Your Resume</h1>
          <h2 style={styles.sectionTitle}>Upload a PDF</h2>
          <form id="upload-form" onSubmit={handleUpload}>
            <input type="file" id="file-upload" name="file-upload" onChange={(e) => setPDF(e.target.files[0])}/>
            {uploadLoading && ( <div style={styles.loaderContainer}> <TailSpin height="40" width="40" color="blue" /></div>)}
            <button type="submit">Upload</button>
          </form>
          <h2 style={styles.sectionTitle}>Or Paste Your Resume to Create a PDF</h2>
          <form id="upload-form" onSubmit={handleUpload}>
            <h2 style={styles.wordcount} >Do not exceed 10,000 characters</h2>
            <textarea id="textInput" rows="10" cols="50" placeholder="Paste the resume here..." onChange={(e) => setInput(e.target.value)} onInput={letterCounter}></textarea>
            <div id="char-count-container">
                <span id="char-count">{letterCount}</span> / 10,000 characters
              </div>
            {uploadLoading && ( <div style={styles.loaderContainer}> <TailSpin height="40" width="40" color="blue" /></div>)}
            <button type="submit" label="generate" style={styles.button} onClick={(e) => setPDF(makePDF(resInput))}>Generate PDF</button>
            {error && <p style={styles.error}>{error}</p>}
            {success && <div style={{ color: 'green' }}>{success}</div>}
          </form>
        </div>

        <div style={styles.containerDescription}>
          <form id="job-form" onSubmit={handleDescription}>
              <h1 style={styles.title}>Enter Your Job Description</h1>
              <h2 style={styles.wordcount} >Do not exceed 5,000 characters</h2>
              <textarea onChange={(e) => setDescription(e.target.value)} onInput={wordCounter} id="job-description" name="job-description" rows="6" cols="50" placeholder="Paste the job description here..."></textarea>
              <div id="char-count-container">
                <span id="char-count">{wordCount}</span> / 5000 characters
              </div>
              {uploadLoading}
              {err && <p style={styles.error}>{err}</p>}
              {succ && <div style={{ color: 'green' }}>{succ}</div>}
              {descLoading && ( <div style={styles.loaderContainer}> <TailSpin height="40" width="40" color="blue" /></div>)}
              <button style={styles.button} type="submit">Submit</button>
          </form>
        </div>

        <form id="get-results" onSubmit={getFitScore}>
          {er && <p style={styles.error}>{er}</p>}
          {s && <div style={{ color: 'green' }}>{s}</div>}
          {resultsLoading && ( <div style={styles.loaderContainer}> <TailSpin height="40" width="40" color="blue" /></div>)}
          <button style={styles.resultsButton} type="submit">Get My Results!</button>
        </form>
      </div>  


      <div style={styles.rightContainer}>

        <div style={styles.section}>
          <h1 style={styles.title}>Resume Analysis Dashboard</h1>
          <h2 style={styles.sectionTitle}>Resume Fit Score</h2>
          <p>Your resume matches the job description by:</p>
          <div style={styles.circularProgressContainer}>
            <CircularProgressbar 
              value={fitScore} 
              text={`${fitScore}%`} 
              strokeWidth={10}
            />
          </div>
        </div>
        
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Matched Keywords</h2>
          {matchedSkills.length > 0 ? (
            <ListGroup>
              {matchedSkills.map((skill, index) => (
                <ListGroupItem key={index} style={styles.listItem}>
                  {skill}
                </ListGroupItem>
              ))}
            </ListGroup>
          ) : (
            <p>Find out what skills you align with the job description.</p>
          )}
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Missing Keywords</h2>
          {missingSkills.length > 0 ? (
            <ListGroup>
              {missingSkills.map((skill, index) => (
                <ListGroupItem key={index} style={styles.listItem}>
                  {skill}
                </ListGroupItem>
              ))}
            </ListGroup>
          ) : (
            <p>Find out what skills you are missing.</p>
          )}
        </div>
        
        <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Improvement Suggestions</h2>
        <select onChange={(e) => setFilter(e.target.value)} style={styles.select}>
          <option value="All">All</option>
          <option value="Skills">Skills</option>
          <option value="Experience">Experience</option>
          <option value="Formatting">Formatting</option>
        </select>

        {filteredSuggestions.length > 0 ? (
          <ListGroup>
            {filteredSuggestions.map((suggestion, index) => (
              <ListGroupItem key={index} style={styles.listItem}>
                {suggestion}
              </ListGroupItem>
            ))}
          </ListGroup>
        ) : (
          <p>No suggestions available for the selected category.</p>
        )}
      </div>

        {pdfError && <p style={styles.error}>{pdfError}</p>}
        <button style={styles.resultsButton} onClick={() => generatePDF(fitScore, missingSkills, matchedSkills, suggestions)}>
          Download PDF Report
        </button>
      </div>
      </div>
  </div>
  );
};

export {Dashboard, PrivateRoute};