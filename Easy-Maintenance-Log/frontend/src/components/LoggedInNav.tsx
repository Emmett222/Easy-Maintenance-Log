import "./LoggedInNav.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/api";
import darken from "../util/colorUtil";

function LoggedInNav() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Loading user");
  useEffect(() => {
    getUser().then((result) => {
      setUsername(result.username);
    });
  }, []); // Empty array so it runs once on first render.

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
        <button
          style={style}
          className="clickDeepen navbutton"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
        <button
          style={style}
          className="clickDeepen navbutton"
          onClick={() => navigate("/user")}
        >
          {username}
        </button>
      </section>
    </section>
  );
}

export default LoggedInNav;
