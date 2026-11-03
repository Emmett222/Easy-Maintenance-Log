import LoggedInNav from "../components/LoggedInNav";
import { useEffect, useState } from "react";

// import { getCar } from "../services/api";

function Service() {
  const [car] = useState("Loading user...");
  const [error, setError] = useState("");
//   useEffect(() => {
//     getCar().then((result) => {
//       setUsername(result.username);
//       setUserID(result.id);
//     });
//   }, []); // Empty array so it runs once on first render.
  
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const createResponse = await createCar({
//         name: name,
//         milage: parseInt(milage, 10),
//         color: color,
//         owner: userID,
//       });

//       navigate("/dashboard");
//     } catch (err) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError("An unexpected error occured.");
//       }
//     }
//   };
  return (
    <section>
      <LoggedInNav />
      <section id="all">
        <h2>Add service to </h2>
        <section id="form">
          <h2>What was the service?</h2>
          <p>
            Can be anything done to the car.
          </p>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter the service done to the car."
            // onChange={(e) => setName(e.target.value)}
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
            // onChange={(e) => setMilage(e.target.value)}
            required
          ></input>
          <h2>Finish:</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Add maintenance!</button>
        </section>
      </section>
    </section>
  );
}
