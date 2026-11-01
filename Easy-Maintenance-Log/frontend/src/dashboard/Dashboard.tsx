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
    <section>
      <LoggedInNav />
      <section id="all">
        
        <section id="middle">
          <section id="middlemeter">
            <h2>YOUR CARS</h2>
          
          <section id="cars">
            <section id="dashes">
              
              <ul id="carslist">
                {cars.map((car) => (
                  <section key={car.id} id="carcard">
                    <p>
                      {car.name} | {car.milage}
                    </p>
                    <input
                      type="number"
                      id="milage"
                      name="milage"
                      min="1"
                      step="1"
                      placeholder="Type new milage here"
                      value={newMilage[car.id] || ""}
                      onChange={(e) =>
                        setNewMilage((prev) => ({
                          ...prev,
                          [car.id]: parseInt(e.target.value, 10),
                        }))
                      }
                    />
                    <button onClick={() => milageUpdate(car.id)}>
                      Update milage
                    </button>
                    <button>View Maintenance</button>
                  </section>
                ))}
              </ul>
              <button id="addbtn" onClick={() => navigate("/addcar")}>Add a car</button>
            </section>
          </section>
          </section>
          <section id="middlemeter">

          <h2>UPCOMING MAINTENANCE</h2>
          <section id="upcoming">
            <section id="dashes">
              
            </section>
          </section>
          </section>
        </section>
      </section>
    </section>
  );
}

export default Dashboard;
