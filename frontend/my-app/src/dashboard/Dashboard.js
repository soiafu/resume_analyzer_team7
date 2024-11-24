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

const Dashboard = ({ fitScore = 0, matchedSkills = [], suggestions = [] }) => {
  const navigate = useNavigate();
  const [pdf, setPDF] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [descLoading, setDescLoading] = useState(false);

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
          'Content-Type': 'multipart/form-data', // Ensure that the content type is set to multipart/form-data
        },
      });
      setUploadLoading(false);
      console.log('POST response data:', postResponse.data);
      setSuccess('PDF Submitted!');
      

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
    setDescription('');
    setErr('');
    setSucc('');
    try {
      setDescLoading(true);
      const postResponse = await axios.post('http://localhost:5000/api/job-description', {
        "job-description": description
      });
      setDescLoading(false);
      console.log('POST response data:', postResponse.data);
      setSucc('Submitted.')
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


function makePDF(text) {
    const doc = new jsPDF(); 
    doc.text(text, 10, 10);
    const pdfBlob = doc.output("blob");
    setPDF(pdfBlob); 
    console.log("PDF generated and stored in state.");
}

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
          <form id="upload-form" onSubmit={handleUpload}>
            <textarea id="textInput" rows="10" cols="50" placeholder="Enter text here"></textarea>
            {uploadLoading && ( <div style={styles.loaderContainer}> <TailSpin height="40" width="40" color="blue" /></div>)}
            <button type="submit" onClick={(e) => makePDF(e.target.value)}>Generate PDF</button>
            {error && <p style={styles.error}>{error}</p>}
            {success && <div style={{ color: 'green' }}>{success}</div>}
          </form>
        </div>

        <div style={styles.containerDescription}>
          <form id="job-form" onSubmit={handleDescription}>
              <h1 style={styles.title}>Enter Your Job Description</h1>
              <textarea onChange={(e) => setDescription(e.target.value)} onInput={wordCounter} id="job-description" name="job-description" rows="6" cols="50" placeholder="Paste the job description here..."></textarea>
              <div id="char-count-container">
                <span id="char-count">{wordCount}</span> / 5000 characters
              </div>
              {err && <p style={styles.error}>{err}</p>}
              {succ && <div style={{ color: 'green' }}>{succ}</div>}
              {descLoading && ( <div style={styles.loaderContainer}> <TailSpin height="40" width="40" color="blue" /></div>)}
              <button style={styles.button} type="submit">Submit</button>
          </form>
        </div>
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
          <h2 style={styles.sectionTitle}>Skills and Keywords Matched</h2>
          {matchedSkills.length > 0 ? (
            <ListGroup>
              {matchedSkills.map((skill, index) => (
                <ListGroupItem key={index} style={styles.listItem}>
                  {skill}
                </ListGroupItem>
              ))}
            </ListGroup>
          ) : (
            <p>No matched skills found.</p>
          )}
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Improvement Suggestions</h2>
          {suggestions.length > 0 ? (
            <ListGroup>
              {suggestions.map((suggestion, index) => (
                <ListGroupItem key={index} style={styles.listItem}>
                  {suggestion}
                </ListGroupItem>
              ))}
            </ListGroup>
          ) : (
            <p>Great resume, no improvement suggestions at this time.</p>
          )}
        </div>
      </div>
      </div>
  </div>
  );
};

export {Dashboard, PrivateRoute};
