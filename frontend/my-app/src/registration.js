import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError(''); // Clear any previous errors
    setLoading(true); // Show loading state

    try {
      // Send the registration data directly to the server
      const postResponse = await axios.post('http://localhost:5000/api/register', {
        email,
        username,
        password,
      });
      console.log('POST response data:', postResponse.data);
      // Handle success (e.g., navigate to another page or display success message)
    } catch (err) {
      // Handle errors
      if (err.response) {
        // If the server responded with an error status
        setError(err.response.data.message || 'An error occurred');
      } else if (err.request) {
        // If no response was received from the server
        setError('No response from server. Please try again later.');
      } else {
        // If there was an error setting up the request
        setError('Error occurred while making the request.');
      }
    } finally {
      setLoading(false); // Hide loading state after request completes
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}  {/* Display error message if any */}
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
