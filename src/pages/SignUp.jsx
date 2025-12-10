import React, { useState } from "react";
import axios from "axios";

// SignUp component handles user registration
function SignUp({ onRegistered }) {
  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  // Error message state
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // clear error when typing
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation 
    // Name must be at least 2 characters
    if (formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters long");
      return;
    }

    // Simple email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email address");
      return;
    }
    // Password minimum length check
    if (formData.password.length < 9) {
      setError("Password must be at least 9 characters long");
      return;
    }
    

    try {
      const result = await axios.post("http://localhost:3001/auth/signup", formData);
      console.log("Signup success:", result.data);
      setError("");
      onRegistered(); // switch to login modal
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="modal-content">
      <span className="close" onClick={onRegistered}>&times;</span>
      <h2>Register</h2>
            {error && (
        <p style={{ color: "red", fontSize: "0.85rem", fontWeight: "bold" }}>
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password (min 9 characters)"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default SignUp;
