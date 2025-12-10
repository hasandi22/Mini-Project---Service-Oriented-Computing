import React, { useState } from "react";
// Import Signup and Login components
import SignUp from "./SignUp";
import Login from "./Login";
import "../styles/modal.css";

function Landing({ onLogin }) {
  // State to track whether Signup modal is open
  const [showSignup, setShowSignup] = useState(false);
  // State to track whether Login modal is open
  const [showLogin, setShowLogin] = useState(false);
  // Check if either modal is open
  const isModalOpen = showSignup || showLogin; // check if any modal is open

  return (
    <div className="landing-page text-center">
      {/* Only show landing page when no modal is open */}
      {!isModalOpen && (
        <>
          <h1>🌍 Welcome to Global Health and Travel Safety Dashboard</h1>
          <p>Check COVID stats and travel advisories for any country.</p>

          <div className="landing-buttons">
            <button className="btn btn-primary m-2" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button className="btn btn-success m-2" onClick={() => setShowSignup(true)}>
              Signup
            </button>
            <button className="btn btn-danger m-2" onClick={() => window.location.href = "http://localhost:3001/auth/google"}>
              Sign in with Google
              </button>



          </div>
        </>
      )}

      {showSignup && (
        <div className="modal">
          <div className="modal-content">
            <SignUp
              onRegistered={() => {
                setShowSignup(false);
                setShowLogin(true); // automatically open login
              }}
            />
          </div>
        </div>
      )}

      {showLogin && (
  <div className="modal">
    <div className="modal-content">
      <Login
        onLogin={onLogin}
        onClose={() => setShowLogin(false)}   
      />
    </div>
  </div>
)}

    </div>
  );
}

export default Landing;
