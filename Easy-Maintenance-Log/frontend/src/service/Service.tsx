import "./Service.css";
import LoggedInNav from "../components/LoggedInNav";
import { useEffect, useState } from "react";
import { getCarByID } from "../services/cars";
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

// import { getCar } from "../services/api";

function Service() {
  const [services, setServices] = useState<Service[]>();
  const [car, setCar] = useState<Car>();
  const [userID, setUserID] = useState("");
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [cost, setCost] = useState(0.0);
  const [newMileage, setMileage] = useState(0);
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [showMileageInput, setShowMileageInput] = useState(false);
  const [nextMileage, setNextMileage] = useState(0);
  const [nextTime, setNextTime] = useState(0);

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
        date: toISODate(date),
        cost: cost,
        owner: userID,
        next_mileage: nextMileage,
        next_time: nextTime,
      });

      window.location.reload();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occured.");
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
            <section id="record">
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
                    <th>Title</th>
                    <th>Date</th>
                    <th>Mileage</th>
                    <th>Cost</th>
                    <th>Next Time</th>
                    <th>Next Mileage</th>
                    <th style={{ border: "none", padding: "0" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {services?.map((service) => (
                    <tr>
                      <td id="tableDataTitle">{service.title}</td>
                      <td>{formatDateString(service.date)}</td>
                      <td>{service.mileage.toString(10)}</td>
                      <td>{service.cost.toFixed(2).toString()}</td>
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
                            deleteServiceByID(service.id).then(() =>
                              window.location.reload(),
                            );
                          }}
                        >
                          X
                        </BrightButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </MeterBorder>
        </section>
        <section id="right">
          <BrightHeader headerNumber={2} color={car?.color}>
            Add service for {car?.name}
          </BrightHeader>
          <MeterBorder id="formBorder" radius={300} color={car?.color}>
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
                id="description"
                name="description"
                placeholder="Date format: MM-DD-YYYY"
                value={date}
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
                step={1}
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
              <BrightHeader headerNumber={3} color={car?.color}>
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
                  <p>This will be used for time based maintenance reminders.</p>
                  <BrightInput
                    type="number"
                    id="nextmileage"
                    name="nextmileage"
                    min={0}
                    step={1}
                    placeholder="Enter how many months until service repeats. (ex: 3)"
                    value={nextMileage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNextMileage(parseInt(e.target.value))
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
                  <p>
                    This will be used for mileage based maintenance reminders.
                  </p>
                  <BrightInput
                    type="number"
                    id="nexttime"
                    name="nexttime"
                    min={0}
                    step={1}
                    placeholder="Enter how many miles until service repeats."
                    value={nextTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNextTime(parseInt(e.target.value))
                    }
                    color={car?.color}
                    required={false}
                  />
                </section>
              )}

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
          </MeterBorder>
        </section>
      </section>
    </section>
  );
}

export default Service;
