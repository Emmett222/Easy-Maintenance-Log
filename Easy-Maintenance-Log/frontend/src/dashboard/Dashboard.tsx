import "./Dashboard.css";
import LoggedInNav from "../components/LoggedInNav";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../services/api";
import { getCars, updateMilage } from "../services/cars";
import type { Car } from "../services/cars";
import MeterBorder from "../components/styling/MeterBorder";
import BrightHeader from "../components/styling/BrightHeader";
import BrightInput from "../components/styling/BrightInput";

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
      <section id="all" className="pageTransition">
        <section id="columnmeter">
          <BrightHeader headerNumber={2}>YOUR CARS</BrightHeader>
          <MeterBorder radius={300}>
            <section id="meterinsides">
              <ul id="carslist">
                {cars.map((car) => (
                  <section
                    key={car.id}
                    style={{ borderColor: car.color }}
                    id="carcard"
                  >
                    <p>
                      {car.name} | {car.milage}
                    </p>
                    <BrightInput
                      type="number"
                      id="milage"
                      name="milage"
                      min={1}
                      step={1}
                      placeholder="Type new milage here"
                      value={newMilage[car.id] || ""}
                      onChange={(e: { target: { value: string; }; }) =>
                        setNewMilage((prev) => ({
                          ...prev,
                          [car.id]: parseInt(e.target.value, 10),
                        }))
                      }
                      color={car.color}
                      width="inherit"
                      required={false}
                    />
                    <button
                      onClick={() => milageUpdate(car.id)}
                      style={{ borderColor: car.color }}
                    >
                      Update milage
                    </button>
                    <button
                      style={{ borderColor: car.color }}
                      onClick={() => navigate("/service/?car_id=" + car.id)}
                    >
                      View Services
                    </button>
                  </section>
                ))}
              </ul>
              <button id="addbtn" onClick={() => navigate("/addcar")}>
                Add a car
              </button>
            </section>
          </MeterBorder>
        </section>
        <section id="columnmeter">
          <BrightHeader headerNumber={2}>UPCOMING MAINTENANCE</BrightHeader>
          <MeterBorder radius={300}>
            <section id="upcomingList"></section>
          </MeterBorder>
        </section>
      </section>
    </section>
  );
}

export default Dashboard;
