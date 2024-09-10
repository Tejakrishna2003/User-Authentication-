import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);  // Handle success response
      if (response.status === 200) {
        // Store the token in local storage or state
        setSuccessMessage('Signup successful! Redirecting to login...');
        localStorage.setItem('token', response.data.token);
        setTimeout( () => {
        navigate("/home");
        }, 2000);  // Redirect to a protected route
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
    <div className="login">
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <form onSubmit={submit} method="POST">
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
        <input type="submit" value="Login" />
      </form>
      <button onClick={() => navigate("/signup")}>signup</button>

      <div>
        <a href="/auth/google" role="button">
          Sign In with Google
        </a>
      </div>
    </div>
  );
}

export default Login;
