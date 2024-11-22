import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from './dashboardStyles';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { CircularProgressbar } from 'react-circular-progressbar';
import { TailSpin } from "react-loader-spinner";
import backgroundImg from '../background3.png';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken'); // Get token from localStorage

  if (!token) {
    // If no token is found, redirect to the login page
    return <Navigate to="/" replace />;
  }
  console.log('the token is ', token);
  // If token exists, render the children (protected route)
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

  const [description, setDescription] = useState('');
  const [succ, setSucc] = useState('');

  const handleDescription = async (e) => {
    e.preventDefault();
    setDescription('');
    setError('');
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
        setError(err.response.data.error);
      } 
      else if (err.request) {
        setDescLoading(false);
        setError('No response from server. Please try again later.');
      } else {
        setDescLoading(false);
        setError('Error occurred while making the request.');
      }
    } 
  }

  const [wordCount, setWordCount] = useState(0);
  const wordCounter = (event) => {
    setWordCount(0);
    const text = event.target.value;
    const count = text.replace(/\s/g, '').length;
    setWordCount(count);
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
            {error && <p style={styles.error}>{error}</p>}
            {success && <div style={{ color: 'green' }}>{success}</div>}
            {uploadLoading && ( <div style={styles.loaderContainer}> <TailSpin height="40" width="40" color="blue" /></div>)}
            <button type="submit">Upload</button>
          </form>
        </div>

        <div style={styles.containerDescription}>
          <form id="job-form" onSubmit={handleDescription}>
              <h1 style={styles.title}>Enter Your Job Description</h1>
              <textarea onChange={(e) => setDescription(e.target.value)} onInput={wordCounter} id="job-description" name="job-description" rows="6" cols="50" placeholder="Paste the job description here..."></textarea>
              <div id="char-count-container">
                <span id="char-count">{wordCount}</span> / 5000 characters
              </div>
              {error && <p style={styles.error}>{error}</p>}
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