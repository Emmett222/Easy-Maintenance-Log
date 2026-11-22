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
import MeterScreen from "../components/styling/MeterScreen";
import { getAllServiceForCar, type Service } from "../services/services";
import formatDateString from "../util/stringUtil";

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Loading user...");
  const [cars, setCars] = useState<Car[]>([]);
  const [newMileage, setNewMileage] = useState<Record<number, number>>({});

  const [allMileageServices, setAllMileageServices] = useState<Service[]>([]);
  const [allTimeServices, setAllTimeServices] = useState<Service[]>([]);

  useEffect(() => {
    getUser().then((result) => {
      setUsername(result.username);
    });
    fillCars();
  }, []); // Empty array so it runs once on first render.

  function fillCars() {
    getCars().then((result) => {
      setCars(result);
      fillService(result);
    });
  }

  async function fillService(cars: Car[]) {
    let returnAllMileage: Service[] = [];
    let returnAllTime: Service[] = [];
    const today: Date = new Date();

    await Promise.all(
      cars.map(async (car) => {
        const currServices = await getAllServiceForCar(car.id);

        returnAllMileage.push(
          ...currServices.filter(
            (curr) =>
              curr.mileage_dependant &&
              curr.mileage + curr.next_mileage > car.mileage,
          ),
        );

        returnAllTime.push(
          ...currServices.filter(
            (curr) =>
              curr.time_dependant &&
              new Date(formatDateString(curr.date, curr.next_time)) >= today,
          ),
        );
      }),
    );

    setAllMileageServices(
      returnAllMileage.sort(
        (a, b) =>
          a.mileage +
          a.next_mileage -
          a.car_current_mileage -
          (b.mileage + b.next_mileage - b.car_current_mileage),
      ),
    );
    setAllTimeServices(
      returnAllTime.sort(
        (a, b) =>
          new Date(a.next_time).getTime() - new Date(b.next_time).getTime(),
      ),
    );
  }

  function mileageUpdate(carID: number) {
    updateMileage(carID, newMileage[carID]).then(() => {
      fillCars();
    });
  }
  return (
    <section>
      <title>Dashboard - Easy Maintenance Log</title>
      <LoggedInNav showPrint={false}/>
      <section id="all" className="pageTransition">
        <section id="columnmeter">
          <BrightHeader headerNumber={2}>YOUR CARS</BrightHeader>
          <MeterBorder id="carBorder" radius={300}>
            <MeterScreen id="carsScreen">
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
            </MeterScreen>
            <BrightButton
              onClick={() => navigate("/addcar")}
              borderRadius={"30px"}
              width={"20vw"}
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
                    <section>
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
                    <section>
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
