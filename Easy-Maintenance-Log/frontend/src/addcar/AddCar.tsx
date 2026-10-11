import "./AddCar.css";
import LoggedInNav from "../components/LoggedInNav";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../services/api";
import { createCar } from "../services/cars";

function AddCar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Loading user...");
  const [userID, setUserID] = useState("")
  const [name, setName] = useState("");
  const [milage, setMilage] = useState("");
  const [color, setColor] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getUser().then((result) => {
      setUsername(result.username);
      setUserID(result.id);
    });
  }, []); // Empty array so it runs once on first render.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createResponse = await createCar({
        "name": name,
        "milage": parseInt(milage, 10),
        "color": color,
        "owner": userID
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
      <LoggedInNav />
      <form id="all" onSubmit={handleSubmit}>
        <section id="banner">
          <h1>Add a car</h1>
        </section>
        <section id="form">
          <h2>Car name:</h2>
          <p>
            This can be anything you would like to use to identify your car.
            Could be make, model, nickname.
          </p>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter a name for your car"
            onChange={(e) => setName(e.target.value)}
            required
          ></input>
          <h2>Current Milage:</h2>
          <p>This will be used for milage based maintenance reminders.</p>
          <input
            type="number"
            id="milage"
            name="milage"
            min="0"
            step="1"
            onChange={(e) => setMilage(e.target.value)}
            required
          ></input>
          <h2>Color:</h2>
          <p>This will be used for the background of your car's page.</p>
          <input
            type="color"
            id="color"
            name="color"
            onChange={(e) => setColor(e.target.value)}
            required
          ></input>
          <h2>Finish:</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Add car!</button>
        </section>
      </form>
    </>
  );
}

export default AddCar;
