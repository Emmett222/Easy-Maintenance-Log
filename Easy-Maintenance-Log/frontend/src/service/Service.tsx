import "./Service.css";
import LoggedInNav from "../components/LoggedInNav";
import { useEffect, useState } from "react";
import { getCarByID, updateMileage } from "../services/cars";
import { createService, getAllServiceForCar } from "../services/services";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Car } from "../services/cars";
import { deleteServiceByID, type Service } from "../services/services";
import { getUser } from "../services/api";
import MeterBorder from "../components/styling/MeterBorder";
import BrightHeader from "../components/styling/BrightHeader";
import BrightInput from "../components/styling/BrightInput";
import BrightButton from "../components/styling/BrightButton";
import formatDateString from "../util/stringUtil";
import MeterScreen from "../components/styling/MeterScreen";
import THArrow from "../components/styling/THArrow";

// import { getCar } from "../services/api";

function Service() {
  const [services, setServices] = useState<Service[]>([]);
  const [car, setCar] = useState<Car>();
  const [userID, setUserID] = useState("");
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formDate, setDate] = useState("");
  const [cost, setCost] = useState(0.0);
  const [newMileage, setMileage] = useState(0);
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [showMileageInput, setShowMileageInput] = useState(false);
  const [nextMileage, setNextMileage] = useState(0);
  const [nextTime, setNextTime] = useState(0);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isRepair, setIsRepair] = useState(false);

  const [alphabeticalAscending, setAlphabeticalAscending] = useState(false);
  const [dateAscending, setDateAscending] = useState(false);
  const [mileageAscending, setMileageAscending] = useState(false);
  const [costAscending, setCostAscending] = useState(false);
  const [nextMileageAscending, setNextMileageAscending] = useState(false);
  const [nextTimeAscending, setNextTimeAscending] = useState(false);

  const [totalMaintenanceCost, setTotalMaintenanceCost] = useState(0);
  const [totalRepairCost, setTotalRepairCost] = useState(0);
  const [totalRepairCount, setTotalRepairCount] = useState(0);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const carID = parseInt(searchParams.get("car_id") ?? "-1", 10);
    if (carID == -1) {
      navigate("/");
    } else {
      getCarByID(carID).then((result) => {
        setCar(result);
      });
    }

    getAllServiceForCar(carID).then((result) => {
      setServices(result);
      totalsCount(result);
    });

    getUser().then((result) => {
      setUserID(result.id);
    });
  }, []); // Empty array so it runs once on first render.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createResponse = await createService({
        car: car?.id ?? -1,
        title: title,
        description: description,
        mileage: newMileage,
        date: toISODate(formDate),
        cost: cost,
        owner: userID,
        next_mileage: nextMileage,
        next_time: nextTime,
        mileage_dependant: showMileageInput,
        time_dependant: showTimeInput,
        is_maintenance: isMaintenance,
        is_repair: isRepair,
      });

      setServices((prev) => [createResponse, ...prev]);

      setTitle("");
      setDescription("");
      setDate("");
      setCost(0);
      setMileage(0);
      setNextMileage(0);
      setNextTime(0);
      setShowTimeInput(false);
      setShowMileageInput(false);

      const updatedCar = await getCarByID(car?.id ?? -1);
      if (updatedCar.mileage < newMileage) {
        updateMileage(car?.id ?? -1, newMileage);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occured.");
      }
    }
  };

  const handleDelete = async (serviceID: number) => {
    try {
      await deleteServiceByID(serviceID);
      setServices((prevServices) =>
        prevServices.filter((service) => service.id !== serviceID),
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete service.");
      }
    }
  };

  // Needed for the API payload.
  function toISODate(dateStr: string): string {
    const [month, day, year] = dateStr.split("-");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  function isTime(timeBool: boolean, date: Date, next: number): string {
    if (timeBool) {
      return formatDateString(date, next);
    } else {
      return ""; // For empty cell.
    }
  }

  function isMileage(mileBool: boolean, mileage: number, next: number): string {
    if (mileBool) {
      return (mileage + next).toString();
    } else {
      return ""; // For empty cell.
    }
  }

  function sortAlphabetically() {
    if (alphabeticalAscending) {
      setServices((prevServices) =>
        [...prevServices].sort((a, b) => a.title.localeCompare(b.title)),
      );
      setAlphabeticalAscending(false);
    } else {
      setServices((prevServices) =>
        [...prevServices].sort((a, b) => b.title.localeCompare(a.title)),
      );
      setAlphabeticalAscending(true);
    }
  }

  function sortDate() {
    if (dateAscending) {
      setServices((prevServices) =>
        [...prevServices].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        ),
      );
      setDateAscending(false);
    } else {
      setServices((prevServices) =>
        [...prevServices].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
      );
      setDateAscending(true);
    }
  }

  function sortMileage() {
    if (mileageAscending) {
      setServices((prevServices) =>
        [...prevServices].sort((a, b) => a.mileage - b.mileage),
      );
      setMileageAscending(false);
    } else {
      setServices((prevServices) =>
        [...prevServices].sort((a, b) => b.mileage - a.mileage),
      );
      setMileageAscending(true);
    }
  }

  function sortCost() {
    if (costAscending) {
      setServices((prevServices) =>
        [...prevServices].sort((a, b) => a.cost - b.cost),
      );
      setCostAscending(false);
    } else {
      setServices((prevServices) =>
        [...prevServices].sort((a, b) => b.cost - a.cost),
      );
      setCostAscending(true);
    }
  }

  function sortNextTime() {
    if (nextTimeAscending) {
      setServices((prevServices) =>
        [...prevServices].sort(
          (a, b) =>
            new Date(a.next_time).getTime() - new Date(b.next_time).getTime(),
        ),
      );
      setNextTimeAscending(false);
    } else {
      setServices((prevServices) =>
        [...prevServices].sort(
          (a, b) =>
            new Date(b.next_time).getTime() - new Date(a.next_time).getTime(),
        ),
      );
      setNextTimeAscending(true);
    }
  }

  function sortNextMileage() {
    if (nextMileageAscending) {
      setServices((prevServices) =>
        [...prevServices].sort((a, b) => a.next_mileage - b.next_mileage),
      );
      setNextMileageAscending(false);
    } else {
      setServices((prevServices) =>
        [...prevServices].sort((a, b) => b.next_mileage - a.next_mileage),
      );
      setNextMileageAscending(true);
    }
  }

  function totalsCount(toCount: Service[]) {
    let mTotal = 0;
    let rTotal = 0;
    let rCount = 0;
    toCount.forEach((service) => {
      if (service.is_maintenance) {
        mTotal += service.cost;
      }
      if (service.is_repair) {
        rTotal += service.cost;
        rCount++;
      }
    });
    setTotalMaintenanceCost(mTotal);
    setTotalRepairCost(rTotal);
    setTotalRepairCount(rCount);
  }

  return (
    <section>
      <title>Service Record - Easy Maintenance Log</title>
      <LoggedInNav />
      <section id="all" className="pageTransition">
        <section id="left">
          <BrightHeader headerNumber={2} color={car?.color}>
            Service Record for {car?.name}
          </BrightHeader>
          <MeterBorder id="recordBorder" radius={300} color={car?.color}>
            <MeterScreen id="record">
              <table id="recordTable">
                <colgroup>
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "5%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>
                      <section onClick={sortAlphabetically}>
                        <THArrow>
                          <BrightHeader color={car?.color} headerNumber={4}>
                            Title
                          </BrightHeader>
                        </THArrow>
                      </section>
                    </th>
                    <th>
                      <section onClick={sortDate}>
                        <THArrow>
                          <BrightHeader color={car?.color} headerNumber={4}>
                            Date
                          </BrightHeader>
                        </THArrow>
                      </section>
                    </th>
                    <th>
                      <section onClick={sortMileage}>
                        <THArrow>
                          <BrightHeader color={car?.color} headerNumber={4}>
                            Mileage
                          </BrightHeader>
                        </THArrow>
                      </section>
                    </th>
                    <th>
                      <section onClick={sortCost}>
                        <THArrow>
                          <BrightHeader color={car?.color} headerNumber={4}>
                            Cost
                          </BrightHeader>
                        </THArrow>
                      </section>
                    </th>
                    <th>
                      <section onClick={sortNextTime}>
                        <THArrow>
                          <BrightHeader color={car?.color} headerNumber={4}>
                            Next Time
                          </BrightHeader>
                        </THArrow>
                      </section>
                    </th>
                    <th>
                      <section onClick={sortNextMileage}>
                        <THArrow>
                          <BrightHeader color={car?.color} headerNumber={4}>
                            Next Mileage
                          </BrightHeader>
                        </THArrow>
                      </section>
                    </th>
                    <th style={{ border: "none", padding: "0" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {services?.map((service) => (
                    <tr key={service.id}>
                      <td id="tableDataTitle">{service.title}</td>
                      <td>{formatDateString(service.date)}</td>
                      <td>{service.mileage}</td>
                      <td>${service.cost.toFixed(2)}</td>
                      <td>
                        {isTime(
                          service.time_dependant,
                          service.date,
                          service.next_time,
                        )}
                      </td>
                      <td>
                        {isMileage(
                          service.mileage_dependant,
                          service.mileage,
                          service.next_mileage,
                        )}
                      </td>
                      <td
                        style={{
                          border: "none",
                          padding: "0",
                          paddingLeft: "10px",
                        }}
                      >
                        <BrightButton
                          borderRadius={"20px"}
                          width={"70%"}
                          height={"100%"}
                          color={car?.color}
                          onClick={() => {
                            handleDelete(service.id);
                          }}
                        >
                          X
                        </BrightButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </MeterScreen>
            Total spent on maintenance: ${totalMaintenanceCost.toFixed(2)} | Total spent on repairs: ${totalRepairCost.toFixed(2)} | Total times repaired: {totalRepairCount}
          </MeterBorder>
        </section>
        <section id="right">
          <BrightHeader headerNumber={2} color={car?.color}>
            Add service for {car?.name}
          </BrightHeader>
          <MeterBorder id="formBorder" radius={300} color={car?.color}>
            <MeterScreen>
              <form id="form" onSubmit={handleSubmit}>
                <BrightHeader headerNumber={3} color={car?.color}>
                  Service name:
                </BrightHeader>
                <BrightInput
                  type="text"
                  id="titleinput"
                  name="titleinput"
                  placeholder="Enter the service done to the car."
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTitle(e.target.value)
                  }
                  color={car?.color}
                  required={true}
                />
                <BrightHeader headerNumber={3} color={car?.color}>
                  Describe the service <em>(Optional)</em>:
                </BrightHeader>
                <BrightInput
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Describe the service."
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDescription(e.target.value)
                  }
                  color={car?.color}
                  required={false}
                />
                <BrightHeader headerNumber={3} color={car?.color}>
                  Date of service:
                </BrightHeader>
                <BrightInput
                  type="text"
                  id="date"
                  name="date"
                  placeholder="Date format: MM-DD-YYYY"
                  value={formDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDate(e.target.value)
                  }
                  color={car?.color}
                  required={true}
                />
                <BrightHeader headerNumber={3} color={car?.color}>
                  Cost:
                </BrightHeader>
                <BrightInput
                  type="number"
                  id="cost"
                  name="cost"
                  placeholder="Enter the cost of the service."
                  min={0}
                  step={0.01}
                  value={cost}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCost(parseFloat(e.target.value))
                  }
                  color={car?.color}
                  required={true}
                />
                <BrightHeader headerNumber={3} color={car?.color}>
                  Current Mileage:
                </BrightHeader>
                <BrightInput
                  type="number"
                  id="mileage"
                  name="mileage"
                  placeholder="Enter the current mileage of the car."
                  min={0}
                  step={1}
                  value={newMileage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setMileage(parseInt(e.target.value))
                  }
                  color={car?.color}
                  required={true}
                />
                <BrightHeader headerNumber={3} color={car?.color}>
                  Repeated with time, or with mileage?
                </BrightHeader>
                <BrightHeader headerNumber={4} color={car?.color}>
                  Select neither if this does not need to be repeated.
                </BrightHeader>
                <section id="checkboxes">
                  <p>Time:</p>
                  <input
                    type="checkbox"
                    id="isTime"
                    name="isTime"
                    onChange={(e) => setShowTimeInput(e.target.checked)}
                  ></input>
                  <p>Mileage:</p>
                  <input
                    type="checkbox"
                    id="isMileage"
                    name="isMileage"
                    onChange={(e) => setShowMileageInput(e.target.checked)}
                  ></input>
                </section>
                {showTimeInput && (
                  <section>
                    <BrightHeader headerNumber={3} color={car?.color}>
                      Time till repeat:
                    </BrightHeader>
                    <p id="timeP">
                      This will be used for time based maintenance reminders.
                    </p>
                    <BrightInput
                      type="number"
                      id="nexttime"
                      name="nexttime"
                      min={0}
                      step={1}
                      placeholder="Enter how many months until service repeats. (ex: 3)"
                      value={nextTime}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNextTime(parseInt(e.target.value))
                      }
                      color={car?.color}
                      required={false}
                    />
                  </section>
                )}
                {showMileageInput && (
                  <section>
                    <BrightHeader headerNumber={3} color={car?.color}>
                      Miles till repeat:
                    </BrightHeader>
                    <p id="mileP">
                      This will be used for mileage based maintenance reminders.
                    </p>
                    <BrightInput
                      type="number"
                      id="nextmileage"
                      name="nextmileage"
                      min={0}
                      step={1}
                      placeholder="Enter how many miles until service repeats."
                      value={nextMileage}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNextMileage(parseInt(e.target.value))
                      }
                      color={car?.color}
                      required={false}
                    />
                  </section>
                )}
                <BrightHeader headerNumber={3} color={car?.color}>
                  Is this maintenance, or is it a repair?
                </BrightHeader>
                <BrightHeader headerNumber={4} color={car?.color}>
                  Select neither if it is neither.
                </BrightHeader>
                <section id="checkboxes">
                  <p>Maintenance:</p>
                  <input
                    type="checkbox"
                    id="isMaintenance"
                    name="isMaintenance"
                    onChange={(e) => setIsMaintenance(e.target.checked)}
                  ></input>
                  <p>Repair:</p>
                  <input
                    type="checkbox"
                    id="isRepair"
                    name="isRepair"
                    onChange={(e) => setIsRepair(e.target.checked)}
                  ></input>
                </section>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <section id="addcontainer">
                  <BrightButton
                    type="submit"
                    borderRadius={"30px"}
                    color={car?.color}
                    width={"80%"}
                    height={"4vh"}
                  >
                    Submit maintenance
                  </BrightButton>
                </section>
              </form>
            </MeterScreen>
          </MeterBorder>
        </section>
      </section>
    </section>
  );
}

export default Service;
