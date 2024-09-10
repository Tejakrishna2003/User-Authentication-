import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const submit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/signup', {
        username,
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log(response.data);  // Handle success response
      if (response.status === 201) {
        setSuccessMessage('Signup successful! Redirecting to login...');
        setTimeout(() => {
          navigate("/login");  // Redirect to login page after 2 seconds
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message); // Set error message from server response
      } else {
        setError('An error occurred. Please try again.');
      }
  }
};

  return (
    <div className="signup">
      <h1>Signup</h1>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={submit} method="POST">
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input type="submit" value="Signup" />
      </form>
      <button onClick={() => navigate("/login")}>Login</button>

      <div>
        <a href="/auth/google" role="button">
          Sign Up with Google
        </a>
      </div>
    </div>
  );
}

export default Signup;
