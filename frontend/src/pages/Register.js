import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css"; // 👈 Don't forget to import the CSS

function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Disable the button to prevent multiple submissions
    const button = e.target.querySelector('button');
    button.disabled = true;
    
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registration Successful!");
      navigate("/login");
    } catch (err) {
      // Log the error details for debugging
      console.error("Registration failed:", err.response ? err.response.data : err.message);
      alert(err.response ? err.response.data.message : "Registration failed");
    } finally {
      // Re-enable the button after the request is complete
      button.disabled = false;
    }
  };
  

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-title">Register</h2>
        
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="register-input"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="register-input"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="register-input"
          onChange={handleChange}
          required
        />
        
        <button type="submit" className="register-button">
          Register
        </button>

        <p className="register-footer">
          Already have an account?{" "}
          <Link to="/login" className="register-link">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
