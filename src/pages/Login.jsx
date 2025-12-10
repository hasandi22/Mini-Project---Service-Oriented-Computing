import React, { useState } from "react";

function Login({ onLogin, onClose }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (formData.password.length < 9) {
      setError("Password must be at least 9 characters long");
      return;
    }

    try {
      // Send login request to backend
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Login successful → save JWT token under `token`
        localStorage.setItem("token", data.token);
        onLogin(); // Switch to Dashboard
      } else {
        // Show backend error
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login request error:", err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="modal-content">
      <span className="close" onClick={onClose}>
        &times;
      </span>
      <h2>Login</h2>
      {error && (
        <p style={{ color: "red", fontSize: "0.85rem", fontWeight: "bold" }}>
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
