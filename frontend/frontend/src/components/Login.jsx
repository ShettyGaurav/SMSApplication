import React, { useState } from "react";
import axios from "axios";
import './css/login.css'

const Login = ({setIsLoggedIn}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });
      console.log(response)
      if(response.status === 200){
        setIsLoggedIn(true)
          setMessage(response.data.message);
      }
       // Display success message
      // Optionally, store user data/token in local storage or redirect
    } catch (error) {
      console.error("Login error:", error); // Debug error
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div id="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
          id="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
          id="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button id="button" type="submit">Login</button>
      </form>

      {message && <p id="para">{message}</p>}
    </div>
  );
};

export default Login;
