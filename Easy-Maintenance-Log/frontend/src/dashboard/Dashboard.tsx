import "./Dashboard.css";
import LoggedInNav from "../components/LoggedInNav";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCars, updateMileage } from "../services/cars";
import type { Car } from "../services/cars";
import MeterBorder from "../components/styling/MeterBorder";
import BrightHeader from "../components/styling/BrightHeader";
import BrightInput from "../components/styling/BrightInput";
import BrightButton from "../components/styling/BrightButton";
import MeterScreen from "../components/styling/MeterScreen";
import type { Service } from "../services/services";
import formatDateString from "../util/stringUtil";
import { fetchAllServices } from "./DashboardFetcher";
import { sortMileage, sortTime } from "./DashboardSorter";

function Dashboard() {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [newMileage, setNewMileage] = useState<Record<number, number>>({});

  const [allMileageServices, setAllMileageServices] = useState<Service[]>([]);
  const [allTimeServices, setAllTimeServices] = useState<Service[]>([]);

  useEffect(() => {
    fillData();
  }, []); // Empty array so it runs once on first render.

  async function fillData() {
    try {
      const result = await getCars();
      setCars(result);

      const allServices = await fetchAllServices(result);
      setAllMileageServices(sortMileage(allServices));
      setAllTimeServices(sortTime(allServices));
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  }

  function mileageUpdate(carID: number) {
    const mileage = newMileage[carID];
    if (!Number.isFinite(mileage) || mileage <= 0) return;

    updateMileage(carID, newMileage[carID]).then(() => {
      fillData();
    });
  }
  return (
    <section>
      <title>Dashboard - Easy Maintenance Log</title>
      <LoggedInNav showPrint={false} />
      <section id="dashboardAll" className="pageTransition">
        <section id="columnmeter">
          <BrightHeader headerNumber={2}>YOUR CARS</BrightHeader>
          <MeterBorder id="carBorder" radius={300}>
            <MeterScreen id="carsScreen">
              <section id="carslist">
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
                      width={"min(80%, 200px)"}
                      height={""}
                      color={car.color}
                    >
                      Update mileage
                    </BrightButton>
                    <BrightButton
                      onClick={() => navigate("/service/?car_id=" + car.id)}
                      borderRadius={"10px"}
                      width={"min(80%, 200px)"}
                      height={""}
                      color={car.color}
                    >
                      View Services
                    </BrightButton>
                  </section>
                ))}
              </section>
            </MeterScreen>
            <BrightButton
              onClick={() => navigate("/addcar")}
              borderRadius={"30px"}
              width={"min(60vw, 240px)"}
              height={"5vh"}
            >
              Add a car
            </BrightButton>
          </MeterBorder>
        </section>
        <section id="columnmeter">
          <BrightHeader headerNumber={2}>UPCOMING MAINTENANCE</BrightHeader>
          <MeterBorder id="upcomingBorder" radius={300}>
            <MeterScreen id="upcomingScreen">
              <section id="upcomingListMileageContainer">
                <BrightHeader headerNumber={3}>By Mileage</BrightHeader>
                <ul id="upcomingListMileage">
                  {allMileageServices.map((service) => (
                    <section key={service.id}>
                      <section id="serviceItem">
                        <BrightHeader
                          headerNumber={4}
                          color={service.car_color}
                        >
                          {service.car_name}
                        </BrightHeader>
                        <p>{service.title}</p>
                        <p>{service.next_mileage + service.mileage}</p>
                      </section>
                      <hr />
                    </section>
                  ))}
                </ul>
              </section>
              <section id="upcomingListTimeContainer">
                <BrightHeader headerNumber={3}>By Time</BrightHeader>
                <ul id="upcomingListTime">
                  {allTimeServices.map((service) => (
                    <section key={service.id}>
                      <section id="serviceItem">
                        <BrightHeader
                          headerNumber={4}
                          color={service.car_color}
                        >
                          {service.car_name}
                        </BrightHeader>

                        <p>{service.title}</p>
                        <p>
                          {formatDateString(service.date, service.next_time)}
                        </p>
                      </section>
                      <hr />
                    </section>
                  ))}
                </ul>
              </section>
            </MeterScreen>
          </MeterBorder>
        </section>
      </section>
    </section>
  );
}

export default Dashboard;
