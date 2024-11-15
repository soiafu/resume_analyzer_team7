import React, { useState } from 'react';
import styles from './loginRegStyles.js';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); 
    setLoading(true); 

    try {
      const postResponse = await axios.post('http://localhost:5000/api/register', {
        email,
        username,
        password,
      });
      console.log('POST response data:', postResponse.data);
    } 
    catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'An error occurred');
      } else if (err.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('Error occurred while making the request.');
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.leftback}>
        <form onSubmit={handleRegister}>
        <div style={styles.container}>
            <h2 style={styles.title}>Create an Account</h2>
            
              <div style={styles.inputContainer}>
                <label style={styles.label}>Email</label>
                <input
                  type="text"
                  value={email}
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputContainer}>
                <label style={styles.label}>Username</label>
                <input
                  type="text"
                  value={username}
                  placeholder="Enter username"
                  onChange={(e) => setUsername(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputContainer}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  value={password}
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />
              </div>
              {error && <p style={styles.error}>{error}</p>}
              <button type="submit" style={styles.button}>Sign Up</button>

          </div>
        </form>
        </div>
    </div>
  );
};

export default Register;
