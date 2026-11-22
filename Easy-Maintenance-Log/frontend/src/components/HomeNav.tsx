import darken from "../util/colorUtil";
import { primaryColor } from "../util/constants";
import "./HomeNav.css";
import { useNavigate } from "react-router-dom";

function HomeNav() {
  const navigate = useNavigate();
  const style = {
    borderColor: primaryColor, // Redundant, but here to make react not complain.
    "--clicked-in-color": darken(primaryColor, 50),
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
