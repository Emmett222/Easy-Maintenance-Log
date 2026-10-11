import "./AddCar.css";
import LoggedInNav from "../components/LoggedInNav";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../services/api";

function AddCar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Loading user...");
  useEffect(() => {
    getUser().then((result) => {
      setUsername(result.username);
    });
  }, []); // Empty array so it runs once on first render.
  return (
    <>
      <LoggedInNav />
      <section id="all">
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
          ></input>
          <h2>Current Milage:</h2>
          <p>This will be used for milage based maintenance reminders.</p>
          <input
            type="number"
            id="milage"
            name="milage"
            min="0"
            step="1000"
          ></input>
          <h2>Color:</h2>
          <p>This will be used for the background of your car's page.</p>
          <input type="color" id="color" name="color"></input>
          <h2>Finish:</h2>
          <button>Add car!</button>
        </section>
      </section>
    </>
  );
}

export default AddCar;
