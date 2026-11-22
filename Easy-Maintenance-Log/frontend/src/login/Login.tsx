import "./Login.css";
import HomeNav from "../components/HomeNav";
import { useState, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import MeterBorder from "../components/styling/MeterBorder";
import BrightInput from "../components/styling/BrightInput";
import BrightButton from "../components/styling/BrightButton";

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
      <title>Login - Easy Maintenance Log</title>
      <HomeNav />
      <section id="loginAll" className="pageTransition">
        <h1 id="welcome">Welcome back!</h1>
        <section id="meterWrapper">
          <MeterBorder radius={300}>
            <form id="loginForm" onSubmit={handleSubmit}>
              <p>Username:</p>
              <BrightInput
                type={"text"}
                id={"username"}
                placeholder={"Username"}
                value={username}
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setUsername(e.target.value)
                }
                required={true}
                width="min(85%, 340px)"
              />
              <p>Password:</p>
              <BrightInput
                type={"password"}
                id={"password"}
                placeholder={"Password"}
                value={password}
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setPassword(e.target.value)
                }
                required={true}
                width="12vw"
              />
              <section id="buttons">
                {error && <p style={{ color: "red" }}>{error}</p>}
                <BrightButton
                  type="submit"
                  borderRadius={"20px"}
                  width={"clamp(140px, 45%, 200px)"}
                  height={"max(42px, 5vh)"}
                >
                  Sign In
                </BrightButton>
              </section>
            </form>
          </MeterBorder>
        </section>
      </section>
    </>
  );
}

export default Register;
