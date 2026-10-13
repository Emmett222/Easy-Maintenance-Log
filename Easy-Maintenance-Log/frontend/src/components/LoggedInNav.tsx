import "./LoggedInNav.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getUser } from "../services/api";

function LoggedInNav() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Loading user...")
  useEffect(() => {
    getUser().then((result) => {
        setUsername(result.username);
    });
  }, []); // Empty array so it runs once on first render.
  return (
    <section id="navall">
      <button id="navbutton" onClick={() => navigate("/")}>Home</button>
      <button id="navbutton" onClick={() => navigate("/dashboard")}>Dashboard</button>
      <button id="navbutton" onClick={() => logout(navigate)}>Logout</button>
      <button id="navbutton" onClick={() => navigate("/user")}>{username}</button>
    </section>
  );
}

export default LoggedInNav;
