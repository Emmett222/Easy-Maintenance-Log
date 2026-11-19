import "./Dashboard.css";
import LoggedInNav from "../components/LoggedInNav";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../services/api";
import { getCars, updateMileage } from "../services/cars";
import type { Car } from "../services/cars";
import MeterBorder from "../components/styling/MeterBorder";
import BrightHeader from "../components/styling/BrightHeader";
import BrightInput from "../components/styling/BrightInput";
import BrightButton from "../components/styling/BrightButton";

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Loading user...");
  const [cars, setCars] = useState<Car[]>([]);
  const [newMileage, setNewMileage] = useState<Record<number, number>>({});
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

  function mileageUpdate(carID: number) {
    updateMileage(carID, newMileage[carID]).then(() => {
      fillCars();
    });
  }
  return (
    <section>
      <title>Dashboard - Easy Maintenance Log</title>
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
                      {car.name} | {car.mileage}
                    </p>
                    <BrightInput
                      type="number"
                      id="mileage"
                      name="mileage"
                      min={1}
                      step={1}
                      placeholder="Type new mileage here"
                      value={newMileage[car.id] || ""}
                      onChange={(e: { target: { value: string } }) =>
                        setNewMileage((prev) => ({
                          ...prev,
                          [car.id]: parseInt(e.target.value, 10),
                        }))
                      }
                      color={car.color}
                      width="92%"
                      required={false}
                    />
                    <BrightButton
                      onClick={() => mileageUpdate(car.id)}
                      borderRadius={"10px"}
                      width={"100%"}
                      height={""}
                      color={car.color}
                    >
                      Update mileage
                    </BrightButton>
                    <BrightButton
                      onClick={() => navigate("/service/?car_id=" + car.id)}
                      borderRadius={"10px"}
                      width={"100%"}
                      height={""}
                      color={car.color}
                    >
                      View Services
                    </BrightButton>
                  </section>
                ))}
              </ul>
              <BrightButton
                onClick={() => navigate("/addcar")}
                borderRadius={"30px"}
                width={"20vw"}
                height={"5vh"}
              >
                Add a car
              </BrightButton>
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
