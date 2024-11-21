import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './dashboardStyles';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { CircularProgressbar } from 'react-circular-progressbar';
import backgroundImg from '../background3.png';

const Dashboard = ({ fitScore = 0, matchedSkills = [], suggestions = [] }) => {
  const navigate = useNavigate();
  const [pdf, setPDF] = useState('');
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    setPDF('');
    setError('')
    try {
      const postResponse = await axios.post('http://localhost:5000/api/resume-upload', {
        pdf,
      });
      console.log('POST response data:', postResponse.data);
    } 

    catch (err) {
      if (err.response) {
        console.log('Backend error message:', err.response.data.message);
        setError(err.response.data.error);
      } 
      else if (err.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('Error occurred while making the request.');
      }
    } 

  }

  const [description, setDescription] = useState('');
  
  const handleDescription = async (e) => {
    setDescription('');
    setError('')
    try {
      const postResponse = await axios.post('http://localhost:5000/api/job-description', {
        description,
      });
      console.log('POST response data:', postResponse.data);
    } 

    catch (err) {
      if (err.response) {
        console.log('Backend error message:', err.response.data.message);
        setError(err.response.data.error);
      } 
      else if (err.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('Error occurred while making the request.');
      }
    } 
  }

  return(
  <div style={styles.background}>
    <div style={styles.container}>
      <div style={styles.leftContainer}>
        <div style={styles.containerResume}>
          <h1 style={styles.title}>Upload Your Resume</h1>
          <h2 style={styles.sectionTitle}>Upload a PDF</h2>
          <form id="upload-form">
            <input type="file" id="file-upload" name="file-upload" accept=".pdf" />
            <button onClick={handleUpload} type="submit">Upload</button>
          </form>
        </div>

        <div style={styles.containerDescription}>
          <form id="job-form">
              <h1 style={styles.title}>Enter Your Job Description</h1>
              <textarea id="job-description" name="job-description" rows="6" cols="50" placeholder="Paste the job description here..."></textarea>
              <div id="char-count-container">
                <span id="char-count">0</span> / 5000 characters
              </div>
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

export default Dashboard;
