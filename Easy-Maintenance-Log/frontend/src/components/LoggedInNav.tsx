import "./LoggedInNav.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/api";
import darken from "../util/colorUtil";
import { primaryColor } from "../util/constants";

function LoggedInNav({ showPrint }: { showPrint: boolean}) {
  const navigate = useNavigate();
  const [username, setUsername] = useState(
    () => localStorage.getItem("username") || "Loading User",
  );

  useEffect(() => {
    getUser().then((result) => {
      setUsername(result.username);
      localStorage.setItem("username", result.username);
    });
  }, []); // Empty array so it runs once on first render.

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
        <button
          style={style}
          className="clickDeepen navbutton"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
        {showPrint && (
          <button
            style={style}
            className="clickDeepen navbutton"
            onClick={() => window.print()}
          >Print</button>
        )}
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
