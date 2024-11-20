import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './dashboardStyles';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { CircularProgressbar } from 'react-circular-progressbar';

const Upload = () => {
  const [pdf, setPDF] = useState('');
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    setPDF('');
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
  return (
    <div style={styles.containerLeft}>
      <h1 style={styles.title}>Upload Your Resume</h1>
      <h2 style={styles.sectionTitle}>Upload a PDF</h2>
      <form id="upload-form">
        <input type="file" id="file-upload" name="file-upload" accept=".pdf" />
        <button onClick={handleUpload} type="submit">Upload</button>
      </form>
    </div>
  );
};


const Description = () => {
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    setDescription('');
    try {
      const postResponse = await axios.post('http://localhost:5000/api/resume-upload', {
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
  return (
    <div style={styles.containerLeft}>
      <form id="job-form">
          <h1 style={styles.title}>Enter Your Job Description</h1>
          <textarea id="job-description" name="job-description" rows="6" cols="50" placeholder="Paste the job description here..."></textarea>
          <div id="char-count-container">
            <span id="char-count">0</span> / 5000 characters
          </div>
          <button style={styles.button} type="submit">Submit</button>
      </form>
    </div>
  );
};


const Dashboard = ({ fitScore = 0, matchedSkills = [], suggestions = [] }) => {
  const navigate = useNavigate();
  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.title}>Resume Analysis Dashboard</h1>
        
        <div style={styles.section}>
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
  );
};

export {Upload, Description, Dashboard};
