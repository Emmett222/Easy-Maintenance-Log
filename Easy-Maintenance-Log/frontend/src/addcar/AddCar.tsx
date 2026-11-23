import "./AddCar.css";
import LoggedInNav from "../components/LoggedInNav";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, type SetStateAction } from "react";
import { getUser } from "../services/api";
import { createCar } from "../services/cars";
import BrightHeader from "../components/styling/BrightHeader";
import MeterBorder from "../components/styling/MeterBorder";
import BrightInput from "../components/styling/BrightInput";
import BrightButton from "../components/styling/BrightButton";

function AddCar() {
  const navigate = useNavigate();
  const [userID, setUserID] = useState("");
  const [name, setName] = useState("");
  const [mileage, setMileage] = useState("");
  const [color, setColor] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getUser().then((result) => {
      setUserID(result.id);
    });
  }, []); // Empty array so it runs once on first render.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCar({
        name: name,
        mileage: parseInt(mileage, 10),
        color: color,
        owner: userID,
      });

      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occured.");
      }
    }
  };

  return (
    <>
      <title>Add Car - Easy Maintenance Log</title>
      <LoggedInNav showPrint={false} />
      <section id="addCarAll" className="pageTransition">
        <BrightHeader headerNumber={1}>Add a car</BrightHeader>
        <form id="addCarForm" onSubmit={handleSubmit}>
          <MeterBorder radius={300} id="formLines">
            <section id="formContainer">
              <BrightHeader headerNumber={2}>Car Name:</BrightHeader>
              <p>
                This can be anything you would like to use to identify your car.
                Could be make, model, nickname.
              </p>
              <BrightInput
                type={"text"}
                id={"name"}
                value={undefined}
                placeholder="Enter car name"
                width="min(85%, 380px)"
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setName(e.target.value)
                }
                required={true}
              ></BrightInput>
              <BrightHeader headerNumber={2}>Current Mileage:</BrightHeader>
              <p>This will be used for mileage based maintenance reminders.</p>
              <BrightInput
                type={"number"}
                id={"mileage"}
                min={0}
                step={1}
                value={undefined}
                placeholder="Enter mileage"
                width="min(85%, 380px)"
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setMileage(e.target.value)
                }
                required={true}
              ></BrightInput>
              <BrightHeader headerNumber={2}>Color:</BrightHeader>
              <p>This will be used for the background of your car's page.</p>
              <BrightInput
                type={"color"}
                id={"color"}
                value={undefined}
                width="min(85%, 380px)"
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setColor(e.target.value)
                }
                required={true}
              ></BrightInput>
              <BrightHeader headerNumber={2}>Finish:</BrightHeader>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <BrightButton
                type="submit"
                borderRadius={"20px"}
                width={"clamp(140px, 40%, 220px)"}
                height={"max(42px, 5vh)"}
              >
                Add car
              </BrightButton>
            </section>
          </MeterBorder>
        </form>
      </section>
    </>
  );
}

export default AddCar;
