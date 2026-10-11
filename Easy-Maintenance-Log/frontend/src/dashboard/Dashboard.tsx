import "./Dashboard.css";
import LoggedInNav from "../components/LoggedInNav";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../services/api";
import { getCars } from "../services/cars";
import type { Car } from "../services/cars";

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Loading user...");
  const [cars, setCars] = useState<Car[]>([])
  useEffect(() => {
    getUser().then((result) => {
      setUsername(result.username);
    });
    getCars().then((result) => {
      setCars(result);
    });;
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
          <ul>
            {cars.map((car) => (
              <li key={car.id}>{car.name} {car.milage}</li>
            ))}
          </ul>
          <button onClick={() => navigate("/addcar")}>Add a car</button>
        </section>
        <section id="upcoming">
          <h2>Upcoming maintenance:</h2>
        </section>
      </section>
    </>
  );
}

export default Dashboard;
