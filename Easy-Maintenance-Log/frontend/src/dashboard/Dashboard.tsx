import "./Dashboard.css";
import LoggedInNav from "../components/LoggedInNav";
import { useEffect, useState } from "react";
import { getUser } from "../services/api";

function Dashboard() {
  const [username, setUsername] = useState("Loading user...");
  useEffect(() => {
    getUser().then((result) => {
      setUsername(result.username);
    });
  }, []); // Empty array so it runs once on first render.
  return (
    <>
      <LoggedInNav />
      <section id="all">
        <section id="banner">
          <h1>Hello {username}</h1>
        </section>
        <section id="cars">
          <h2>Your cars:</h2>
        </section>
        <section id="upcoming">
          <h2>Upcoming maintenance:</h2>
        </section>
      </section>
    </>
  );
}

export default Dashboard;
