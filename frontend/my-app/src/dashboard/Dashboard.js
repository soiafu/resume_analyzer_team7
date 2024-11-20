import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './dashboardStyles';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { CircularProgressbar } from 'react-circular-progressbar';

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

export default Dashboard;
