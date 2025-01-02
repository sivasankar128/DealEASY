import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../index.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/login" : "/signup";
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });


      const result = await response.json();
      setLoading(false);
      console.log(result);
      if (response.ok) {
        if (isLogin) {
          if (result.isAdmin) {
            alert("Welcome, Admin!");
            localStorage.setItem("isAdmin", "true")
            navigate("/admin");
          } else {
            localStorage.setItem("isAdmin", "false");
            localStorage.setItem("userId", result.userId);
            alert("Login successful!");
            navigate("/products");
          }
        } else {
          alert("Signup successful! Please log in.");
          setIsLogin(true); 
        }
      } else {
        alert(result.message || "An error occurred!");
      }
    } catch (err) {
      setLoading(false); 
      console.error("Error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>{isLogin ? "Login Form" : "Signup Form"}</h1>
        <div className="tab-buttons">
          <button
            className={`tab-button ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
            disabled={loading}
          >
            Login
          </button>
          <button
            className={`tab-button ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
            disabled={loading}
          >
            Signup
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="input-field"
              disabled={loading}
            />
          )}
          <br></br><br></br>    
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="input-field"
            disabled={loading}
          />
          <br></br><br></br>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="input-field"
            disabled={loading}
          />
          {isLogin && <a href="#" className="forgot-link">Forgot password?</a>}
          <button type="submit" className="submit-button">
          {loading ? "Please wait..." : isLogin ? "Login" : "Signup"}
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default AuthPage;
