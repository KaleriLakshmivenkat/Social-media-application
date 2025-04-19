import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // Make sure to import your CSS

function Login({ setIsLoggedIn }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the server
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      
      // Store the token in localStorage
      localStorage.setItem("token", res.data.token);

      // Update the login state in the parent component
      setIsLoggedIn(true);

      // Show success message and redirect
      alert("Login Successful!");
      navigate("/"); // Redirect to Home
    } catch (err) {
      // Handle error (e.g., invalid credentials)
      alert("Login failed: " + err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="login-input"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button type="submit" className="login-button">
          Login
        </button>

        <p className="login-footer">
          Don't have an account?{" "}
          <Link to="/register" className="login-link">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
