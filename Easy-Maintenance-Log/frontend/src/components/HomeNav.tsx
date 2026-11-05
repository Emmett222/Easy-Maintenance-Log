import "./HomeNav.css";
import { useNavigate } from "react-router-dom";

function HomeNav() {
  const navigate = useNavigate();
  return (
    <section id="navall">
      <section id="buttonscontainer">
        <button id="navbutton" onClick={() => navigate("/")}>
          Home
        </button>
        <button id="navbutton">Example</button>
        <button id="navbutton" onClick={() => navigate("/login")}>
          Login
        </button>
        <button id="navbutton" onClick={() => navigate("/register")}>
          Register
        </button>
      </section>
    </section>
  );
}

export default HomeNav;
