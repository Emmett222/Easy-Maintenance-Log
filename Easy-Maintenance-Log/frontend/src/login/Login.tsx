import "./Login.css";
import HomeNav from "../components/HomeNav";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import MeterBorder from "../components/styling/MeterBorder";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser({ username, password });

      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a minute.");
      }

      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to login. Username or password may be incorrect.");
      }
    }
  };

  return (
    <>
      <HomeNav />
      <section id="loginAll" className="pageTransition">
        <h1 id="welcome">Welcome back!</h1>
        <section id="meterWrapper">
          <MeterBorder radius={300}>
            <form id="loginForm" onSubmit={handleSubmit}>
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
              <section id="buttons">
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Sign In</button>
              </section>
            </form>
          </MeterBorder>
        </section>
      </section>
    </>
  );
}

export default Register;
