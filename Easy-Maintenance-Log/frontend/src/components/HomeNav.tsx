import "./HomeNav.css";
import { useNavigate } from "react-router-dom";

function HomeNav() {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate("/")}>Home</button>
      <button>Example</button>
      <button>Login</button>
      <button>Logout</button>
      <button onClick={() => navigate("/register")}>Register</button>
    </>
  );
}

export default HomeNav;
