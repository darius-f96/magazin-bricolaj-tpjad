import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:8080/api/auth";

const AuthPage = () => {
  const [form, setForm] = useState({ username: "", password: "", confirmPassword: "" });
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      if (isLogin) {
        const response = await axios.post(`${API_URL}/login`, {
          username: form.username,
          password: form.password,
        });
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        setMessage("Login successful");
        navigate("/dashboard");
      } else {
        if (form.password !== form.confirmPassword) {
          setMessage("Passwords do not match");
          return;
        }
        await axios.post(`${API_URL}/register`, {
          username: form.username,
          password: form.password,
        });
        setMessage("Registration successful. Please log in.");
        setIsLogin(true);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setMessage("Logged out successfully");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem", textAlign: "center" }}>
      <h1>{isLogin ? "Login" : "Register"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        {!isLogin && (
          <div>
            <label>
              Confirm Password:
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
        )}
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
      <p>{message}</p>
      {isLogin ? (
        <p>
          Don't have an account? <button onClick={() => setIsLogin(false)}>Register</button>
        </p>
      ) : (
        <p>
          Already have an account? <button onClick={() => setIsLogin(true)}>Login</button>
        </p>
      )}
      {localStorage.getItem("accessToken") && (
        <button onClick={handleLogout} style={{ marginTop: "1rem" }}>
          Logout
        </button>
      )}
    </div>
  );
};

export default AuthPage;
