import "./Service.css";
import LoggedInNav from "../components/LoggedInNav";
import { useEffect, useState } from "react";
import { getCarByID } from "../services/cars";
import { createService, getAllServiceForCar } from "../services/services";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Car } from "../services/cars";
import { getUser } from "../services/api";
import MeterBorder from "../components/styling/MeterBorder";
import BrightHeader from "../components/styling/BrightHeader";
import BrightInput from "../components/styling/BrightInput";

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
      <section id="all" className="pageTransition">
        <section id="left">
          <BrightHeader headerNumber={2} color={car?.color}>
            Service Record for {car?.name}
          </BrightHeader>
          <MeterBorder radius={300} color={car?.color}>
            <section id="record"></section>
          </MeterBorder>
        </section>
        <section id="right">
          <BrightHeader headerNumber={2} color={car?.color}>
            Add service for {car?.name}
          </BrightHeader>
          <MeterBorder radius={300} color={car?.color}>
            <section id="form" onSubmit={handleSubmit}>
              <BrightHeader headerNumber={3} color={car?.color}>Service name:</BrightHeader>
              <BrightInput
                type="text"
                id="titleinput"
                name="titleinput"
                placeholder="Enter the service done to the car."
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                color={car?.color}
                required={false}
              />
              <BrightHeader headerNumber={3} color={car?.color}>Date of service:</BrightHeader>
              <BrightInput
                type="text"
                id="description"
                name="description"
                placeholder="Date format: MM-DD-YYYY"
                value={date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                color={car?.color}
                required={true}
              />
              <BrightHeader headerNumber={3} color={car?.color}>Cost:</BrightHeader>
              <BrightInput
                type="number"
                id="cost"
                name="cost"
                placeholder="Enter the cost of the service."
                min={0}
                step={1}
                value={cost}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCost(parseFloat(e.target.value))}
                color={car?.color}
                required={true}
              />
              <BrightHeader headerNumber={3} color={car?.color}>Current Milage:</BrightHeader>
              <BrightInput
                type="number"
                id="milage"
                name="milage"
                placeholder="Enter the current milage of the car."
                min={0}
                step={1}
                value={newMilage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMilage(parseInt(e.target.value))}
                color={car?.color}
                required={true}
              />
              <BrightHeader headerNumber={3} color={car?.color}>Repeated with time, or with milage?</BrightHeader>
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
                  <BrightHeader headerNumber={3} color={car?.color}>Time till repeat:</BrightHeader>
                  <p>This will be used for time based maintenance reminders.</p>
                  <BrightInput
                    type="number"
                    id="nextmilage"
                    name="nextmilage"
                    min={0}
                    step={1}
                    placeholder="Enter how many months until service repeats. (ex: 3)"
                    value={nextMilage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNextMilage(parseInt(e.target.value))}
                    color={car?.color}
                    required={true}
                  />
                </section>
              )}
              {showMilageInput && (
                <section>
                  <BrightHeader headerNumber={3} color={car?.color}>Miles till repeat:</BrightHeader>
                  <p>
                    This will be used for milage based maintenance reminders.
                  </p>
                  <BrightInput
                    type="number"
                    id="nexttime"
                    name="nexttime"
                    min={0}
                    step={1}
                    placeholder="Enter how many miles until service repeats."
                    value={nextTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNextTime(parseInt(e.target.value))}
                    color={car?.color}
                    required={true}
                  />
                </section>
              )}

              {error && <p style={{ color: "red" }}>{error}</p>}
              <section id="addcontainer">
                <button type="submit" id="add">
                  Add maintenance!
                </button>
              </section>
            </section>
          </MeterBorder>
        </section>
      </section>
    </section>
  );
}

export default Service;