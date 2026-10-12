import "./Dashboard.css";
import LoggedInNav from "../components/LoggedInNav";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../services/api";
import { getCars, updateMilage } from "../services/cars";
import type { Car } from "../services/cars";

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Loading user...");
  const [cars, setCars] = useState<Car[]>([]);
  const [newMilage, setNewMilage] = useState<Record<number, number>>({});
  useEffect(() => {
    getUser().then((result) => {
      setUsername(result.username);
    });
    fillCars();
  }, []); // Empty array so it runs once on first render.

  function fillCars() {
    getCars().then((result) => {
      setCars(result);
    });
  }

  function milageUpdate(carID: number) {
    updateMilage(carID, newMilage[carID]).then(() => {
      fillCars();
    });
  }
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
              <section key={car.id}>
                <li>
                  {car.id} {car.name} {car.milage}
                </li>
                <input
                  type="number"
                  id="milage"
                  name="milage"
                  min="1"
                  step="1"
                  value={newMilage[car.id] || ''}
                  onChange={(e) => setNewMilage(prev => ({ ...prev, [car.id]: parseInt(e.target.value, 10) }))}
                />
                <button onClick={() => milageUpdate(car.id)}>Update milage</button>
                <button>Maintenance</button>
              </section>
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
