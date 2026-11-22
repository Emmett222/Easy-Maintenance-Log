import "./User.css";
import { useNavigate } from "react-router-dom";
import LoggedInNav from "../components/LoggedInNav";
import BrightHeader from "../components/styling/BrightHeader";
import { useEffect, useState } from "react";
import { getUser, logout } from "../services/api";
import MeterBorder from "../components/styling/MeterBorder";
import MeterScreen from "../components/styling/MeterScreen";
import {
  deleteCarByID,
  getCars,
  updateColor,
  updateName,
  type Car,
} from "../services/cars";
import BrightInput from "../components/styling/BrightInput";
import BrightButton from "../components/styling/BrightButton";

function user() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Loading user");
  const [cars, setCars] = useState<Car[]>([]);
  const [newName, setNewName] = useState<Record<number, string>>({});
  const [newColor, setNewColor] = useState<Record<number, string>>({});

  useEffect(() => {
    getUser().then((result) => {
      setUsername(result.username);
    });
    fillCars();
  }, []); // Empty array so it runs once on first render.

  function fillCars() {
    getCars().then((result) => {
      setCars(result);
    });
  }

  function nameUpdate(carID: number) {
    updateName(carID, newName[carID]).then(() => {
      fillCars();
    });
  }

  function colorUpdate(carID: number) {
    updateColor(carID, newColor[carID]).then(() => {
      fillCars();
    });
  }

  function deleteCar(carID: number) {
    deleteCarByID(carID).then(() => {
      fillCars();
    });
  }

  function handleLogOut() {
    // Needed so it doesn't fire on page load.
    logout(navigate);
  }

  return (
    <section>
      <title>User Settings - Easy Maintenance Log</title>
      <LoggedInNav showPrint={false}/>
      <section id="userAll" className="pageTransition">
        <section id="userLeft">
          <BrightHeader headerNumber={2}>User Settings</BrightHeader>
          <MeterBorder id="userBorderGeneral" radius={320}>
            <MeterScreen>
              <section id="userHorizontal">
                <BrightHeader headerNumber={3}>Log Out</BrightHeader>
                <BrightButton
                  onClick={handleLogOut}
                  borderRadius={"10px"}
                  width={""}
                  height={""}
                >
                  Logout
                </BrightButton>
              </section>
              <hr />
            </MeterScreen>
          </MeterBorder>
        </section>
        <section id="userRight">
          <BrightHeader headerNumber={2}>Car Settings</BrightHeader>
          <MeterBorder id="userBorderCars" radius={320}>
            <MeterScreen>
              {cars.map((car) => (
                <section id="allCarsSettings">
                  <section id="individualCarSettings">
                    <BrightHeader color={car.color} headerNumber={4}>
                      {car.name}
                    </BrightHeader>
                    <section id="smallForm">
                      <p>Change name:</p>
                      <BrightInput
                        type="text"
                        id="nameChange"
                        onChange={(e: { target: { value: string } }) =>
                          setNewName({
                            [car.id]: e.target.value,
                          })
                        }
                        color={car.color}
                        required={false}
                      />
                      <BrightButton
                        onClick={() => nameUpdate(car.id)}
                        color={car.color}
                        borderRadius={"10px"}
                        width={""}
                        height={""}
                      >
                        Submit
                      </BrightButton>
                    </section>
                    <section id="smallForm">
                      <p>Change color:</p>
                      <BrightInput
                        type={"color"}
                        id={"colorChange"}
                        onChange={(e: { target: { value: string } }) =>
                          setNewColor({
                            [car.id]: e.target.value,
                          })
                        }
                        value={""}
                        color={car.color}
                        required={false}
                      />
                      <BrightButton
                        onClick={() => colorUpdate(car.id)}
                        color={car.color}
                        borderRadius={"10px"}
                        width={""}
                        height={""}
                      >
                        Submit
                      </BrightButton>
                    </section>
                    <section id="smallForm">
                      <p>Delete car:</p>
                      <BrightButton
                        color={car.color}
                        borderRadius={"20px"}
                        onClick={() => deleteCar(car.id)}
                        width={""}
                        height={"50%"}
                      >
                        Delete
                      </BrightButton>
                    </section>
                  </section>
                  <hr />
                </section>
              ))}
            </MeterScreen>
          </MeterBorder>
        </section>
      </section>
    </section>
  );
}

export default user;
