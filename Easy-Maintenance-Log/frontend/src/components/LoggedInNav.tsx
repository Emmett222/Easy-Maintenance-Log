import "./LoggedInNav.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/api";

function LoggedInNav() {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate("/")}>Home</button>
      <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      <button onClick={() => logout(navigate)}>Logout</button>
      <button onClick={() => navigate("/user")}>USERNAMEPLACEHOLDER</button>
    </>
  );
}

export default LoggedInNav;
