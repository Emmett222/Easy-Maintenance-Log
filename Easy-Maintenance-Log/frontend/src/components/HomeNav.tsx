import darken from "../services/colorUtil";
import "./HomeNav.css";
import { useNavigate } from "react-router-dom";

function HomeNav() {
  const navigate = useNavigate();
  const style = {
    borderColor: "rgb(70, 211, 199)", // Redundant, but here to make react not complain.
    "--clicked-in-color": darken("rgb(70, 211, 199)", 50),
  };
  return (
    <section id="navall">
      <section id="buttonscontainer">
        <button
          style={style}
          className="clickDeepen navbutton"
          onClick={() => navigate("/")}
        >
          Home
        </button>
        <button style={style} className="clickDeepen navbutton">
          Example
        </button>
        <button
          style={style}
          className="clickDeepen navbutton"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          style={style}
          className="clickDeepen navbutton"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </section>
    </section>
  );
}

export default HomeNav;
