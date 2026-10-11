import "./Register.css";
import HomeNav from "../components/HomeNav";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../services/api";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Create the account in Django
      await registerUser({ username, email, password });

      // 2. Immediately log them in to get the JWT
      await loginUser({ username, password });

      // 3. Send them to the dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create account. Username may be taken.");
    }
  };

  return (
    <>
      <HomeNav />
      <form onSubmit={handleSubmit}>
        <section id="banner">
          <h1>Register an account</h1>
        </section>
        <section id="inputs">
          <p>Email:</p>
          <input
            type="text"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p>Username:</p>
          <input
            type="username"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <p>Password:</p>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p>Confirm password:</p>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </section>
        <section id="buttons">
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Sign Up</button>
        </section>
      </form>
    </>
  );
}

export default Register;
