import "./Service.css";
import LoggedInNav from "../components/LoggedInNav";
import { useEffect, useState } from "react";
import { getCarByID } from "../services/cars";
import { createService, getAllServiceForCar } from "../services/services";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Car } from "../services/cars";
import { getUser } from "../services/api";

// import { getCar } from "../services/api";

function Service() {
  const [car, setCar] = useState<Car>();
  const [userID, setUserID] = useState("");
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [cost, setCost] = useState(0.0);
  const [newMilage, setMilage] = useState(0);
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [showMilageInput, setShowMilageInput] = useState(false);
  const [nextMilage, setNextMilage] = useState(0);
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
    getUser().then((result) => {
      setUserID(result.id);
    });
  }, []); // Empty array so it runs once on first render.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createResponse = await createService(
        car?.id ?? -1, // Impossible to hit. It'll navigate to home before this can trigger.
        {
          car: car?.id ?? -1,
          title: title,
          description: description,
          milage: newMilage,
          date: toISODate(date),
          cost: cost,
          owner: userID,
          next_milage: nextMilage,
          next_time: nextTime,
        },
      );

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

  return (
    <section>
      <LoggedInNav />
      <section id="all">
        <section id="left">
          <h2>Service Record for {car?.name}</h2>
          <section id="recordlines">
            <section id="record"></section>
          </section>
        </section>
        <section id="right">
          <h2>Add service for {car?.name}</h2>
          <section id="formlines">
            <section id="formdashes">
              <section id="form" onSubmit={handleSubmit}>
                <h3>Service name:</h3>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter the service done to the car."
                  onChange={(e) => setTitle(e.target.value)}
                  required
                ></input>
                <h3>
                  Describe the service <em>(Optional)</em>:
                </h3>
                <input
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Describe the service."
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></input>
                <h3>Date of service:</h3>
                <input
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Date format: MM-DD-YYYY"
                  onChange={(e) => setDate(e.target.value)}
                  required
                ></input>
                <h3>Cost:</h3>
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  placeholder="Enter the cost of the service."
                  min="0"
                  step="1"
                  onChange={(e) => setCost(parseFloat(e.target.value))}
                  required
                ></input>
                <h3>Current Milage:</h3>
                <input
                  type="number"
                  id="milage"
                  name="milage"
                  placeholder="Enter the current milage of the car."
                  min="0"
                  step="1"
                  onChange={(e) => setMilage(parseInt(e.target.value))}
                  required
                ></input>
                <h3>Repeated with time, or with milage?</h3>
                <section id="checkboxes">
                  <p>Time:</p>
                  <input
                    type="checkbox"
                    id="isTime"
                    name="isTime"
                    onChange={(e) => setShowTimeInput(e.target.checked)}
                  ></input>
                  <p>Milage:</p>
                  <input
                    type="checkbox"
                    id="isMilage"
                    name="isMilage"
                    onChange={(e) => setShowMilageInput(e.target.checked)}
                  ></input>
                </section>
                {showTimeInput && (
                  <section>
                    <h3>Time till repeat:</h3>
                    <p>
                      This will be used for time based maintenance reminders.
                    </p>
                    <input
                      type="number"
                      id="nextmilage"
                      name="nextmilage"
                      min="0"
                      step="1"
                      placeholder="Enter how many months until service repeats. (ex: 3)"
                      onChange={(e) => setNextMilage(parseInt(e.target.value))}
                      required
                    ></input>
                  </section>
                )}
                {showMilageInput && (
                  <section>
                    <h3>Miles till repeat:</h3>
                    <p>
                      This will be used for milage based maintenance reminders.
                    </p>
                    <input
                      type="number"
                      id="nexttime"
                      name="nexttime"
                      min="0"
                      step="1"
                      placeholder="Enter how many miles until service repeats."
                      onChange={(e) => setNextTime(parseInt(e.target.value))}
                      required
                    ></input>
                  </section>
                )}

                {error && <p style={{ color: "red" }}>{error}</p>}
                <section id="addcontainer">
                  <button type="submit" id="add">
                    Add maintenance!
                  </button>
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
    </section>
  );
}

export default Service;
