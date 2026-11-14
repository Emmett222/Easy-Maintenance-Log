import "./Register.css";
import HomeNav from "../components/HomeNav";
import { useState, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../services/api";
import MeterBorder from "../components/styling/MeterBorder";
import BrightInput from "../components/styling/BrightInput";
import BrightButton from "../components/styling/BrightButton";

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
      const registerResponse = await registerUser({
        username,
        email,
        password,
      });

      const loginResponse = await loginUser({ username, password });

      if (registerResponse.status === 429 || loginResponse.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a minute.");
      }

      navigate("/dashboard");
      if (registerResponse.ok) {
        navigate("/dashboard");
      } else {
        throw new Error("Failed to register. Username may be taken.");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error has occurred.");
      }
    }
  };

  return (
    <>
      <title>Register - Easy Maintenance Log</title>
      <HomeNav />
      <section id="registerAll" className="pageTransition">
        <h1 id="registerTitle">Register an account</h1>
        <MeterBorder radius={300}>
          <form id="registerForm" onSubmit={handleSubmit}>
            <p>Email:</p>
            <BrightInput
              type={"text"}
              id={"email"}
              placeholder="Enter Email"
              value={email}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setEmail(e.target.value)
              }
              required={true}
              width="15vw"
            />
            <p>Username:</p>
            <BrightInput
              type={"text"}
              id={"username"}
              placeholder="Enter Username"
              value={username}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setUsername(e.target.value)
              }
              required={true}
              width="15vw"
            />
            <p>Password:</p>
            <BrightInput
              type={"password"}
              id={"password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setPassword(e.target.value)
              }
              required={true}
              width="15vw"
            />
            <p>Confirm password:</p>
            <BrightInput
              type={"password"}
              id={"confirmPasswor"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setConfirmPassword(e.target.value)
              }
              required={true}
              width="15vw"
            />
            <section id="buttons">
              {error && <p style={{ color: "red" }}>{error}</p>}
              <BrightButton
                type="submit"
                borderRadius={"20px"}
                width={"7vw"}
                height={"5vh"}
              >Sign Up</BrightButton>
            </section>
          </form>
        </MeterBorder>
      </section>
    </>
  );
}

export default Register;
