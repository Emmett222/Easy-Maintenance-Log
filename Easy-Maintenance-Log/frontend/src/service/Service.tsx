import "./Service.css";
import LoggedInNav from "../components/LoggedInNav";
import { useEffect, useMemo, useState } from "react";
import { getCarByID, updateMileage } from "../services/cars";
import { createService, getAllServiceForCar } from "../services/services";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Car } from "../services/cars";
import {
  deleteServiceByID,
  type Service as ServiceItem,
} from "../services/services";
import { getUser } from "../services/api";
import MeterBorder from "../components/styling/MeterBorder";
import BrightHeader from "../components/styling/BrightHeader";
import BrightInput from "../components/styling/BrightInput";
import BrightButton from "../components/styling/BrightButton";
import formatDateString from "../util/stringUtil";
import MeterScreen from "../components/styling/MeterScreen";
import THArrow from "../components/styling/THArrow";

function Service() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [car, setCar] = useState<Car>();
  const [userID, setUserID] = useState("");
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  type SortKey =
    | "title"
    | "date"
    | "mileage"
    | "cost"
    | "next_time"
    | "next_mileage";
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    ascending: boolean;
  }>({ key: "date", ascending: false });

  // UseMemo is a hook that caches result of calculation between renders.
  const sortedServices = useMemo(() => {
    const direction = sortConfig.ascending ? 1 : -1;

    return [...services].sort((a, b) => {
      switch (sortConfig.key) {
        case "title":
          return direction * a.title.localeCompare(b.title);
        case "date":
          return (
            direction *
            (new Date(a.date).getTime() - new Date(b.date).getTime())
          );
        case "mileage":
          return direction * (a.mileage - b.mileage);
        case "cost":
          return direction * (a.cost - b.cost);
        case "next_mileage":
          return (
            direction *
            (a.mileage + a.next_mileage - (b.mileage + b.next_mileage))
          );
        case "next_time": {
          const timeA = a.time_dependant
            ? new Date(formatDateString(a.date, a.next_time)).getTime()
            : Infinity;
          const timeB = b.time_dependant
            ? new Date(formatDateString(b.date, b.next_time)).getTime()
            : Infinity;
          return direction * (timeA - timeB);
        }
      }
    });
  }, [services, sortConfig]);

  const totalMaintenanceCost = services.reduce(
    (sum, s) => (s.is_maintenance ? sum + Number(s.cost) : sum),
    0,
  );
  const totalRepairCost = services.reduce(
    (sum, s) => (s.is_repair ? sum + Number(s.cost) : sum),
    0,
  );
  const totalRepairCount = services.filter((s) => s.is_repair).length;

  interface FormData {
    title: string;
    description: string;
    date: string;
    cost: number;
    mileage: number;
    isTime: boolean;
    isMileage: boolean;
    nextTime: number;
    nextMileage: number;
    isMaintenance: boolean;
    isRepair: boolean;
  }

  const initialFormData: FormData = {
    title: "",
    description: "",
    date: "",
    cost: 0,
    mileage: 0,
    isTime: false,
    isMileage: false,
    nextTime: 0,
    nextMileage: 0,
    isMaintenance: false,
    isRepair: false,
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);

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
        title: formData.title,
        description: formData.description,
        mileage: formData.mileage,
        date: formData.date,
        cost: formData.cost,
        owner: userID,
        next_mileage: formData.nextMileage,
        next_time: formData.nextTime,
        mileage_dependant: formData.isMileage,
        time_dependant: formData.isTime,
        is_maintenance: formData.isMaintenance,
        is_repair: formData.isRepair,
      });

      setServices((prev) => [createResponse, ...prev]);

      const updatedCar = await getCarByID(car?.id ?? -1);
      if (updatedCar.mileage < formData.mileage) {
        await updateMileage(car?.id ?? -1, formData.mileage);
        setCar(updatedCar);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occured.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  function handleSort(key: SortKey) {
    setSortConfig((prev) => ({
      key,
      // If clicking the same column, flip direction; if clicking a new column, start ascending
      ascending: prev.key === key ? !prev.ascending : true,
    }));
  }

  return (
    <section>
      <title>Service Record - Easy Maintenance Log</title>
      <LoggedInNav showPrint={true} />
      <section id="serviceAll" className="pageTransition">
        <section id="left">
          <BrightHeader headerNumber={2} color={car?.color}>
            Service Record for {car?.name}
          </BrightHeader>
          <MeterBorder id="recordBorder" radius={300} color={car?.color}>
            <MeterScreen id="record">
              <table id="recordTable">
                <colgroup>
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "8%" }} className="no-print" />
                </colgroup>
                <thead>
                  <tr>
                    <th>
                      <section onClick={() => handleSort("title")}>
                        <THArrow>
                          <h4>Title</h4>
                        </THArrow>
                      </section>
                    </th>
                    <th>
                      <section onClick={() => handleSort("date")}>
                        <THArrow>
                          <h4>Date</h4>
                        </THArrow>
                      </section>
                    </th>
                    <th>
                      <section onClick={() => handleSort("mileage")}>
                        <THArrow>
                          <h4>Mileage</h4>
                        </THArrow>
                      </section>
                    </th>
                    <th>
                      <section onClick={() => handleSort("cost")}>
                        <THArrow>
                          <h4>Cost</h4>
                        </THArrow>
                      </section>
                    </th>
                    <th>
                      <section onClick={() => handleSort("next_time")}>
                        <THArrow>
                          <h4>Next Time</h4>
                        </THArrow>
                      </section>
                    </th>
                    <th>
                      <section onClick={() => handleSort("next_mileage")}>
                        <THArrow>
                          <h4>Next Mileage</h4>
                        </THArrow>
                      </section>
                    </th>
                    <th
                      className="no-print"
                      style={{ border: "none", padding: "0" }}
                    ></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedServices?.map((service) => (
                    <tr key={service.id}>
                      <td>{service.title}</td>
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
                        className="no-print"
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
            <p id="totalsText">
              Total spent on maintenance: ${totalMaintenanceCost.toFixed(2)} |
              Total spent on repairs: ${totalRepairCost.toFixed(2)} | Total
              times repaired: {totalRepairCount}
            </p>
          </MeterBorder>

          <section id="mobileAddButtonWrapper" className="no-print">
            <BrightButton
              onClick={() => setIsAddModalOpen(true)}
              borderRadius={"30px"}
              color={car?.color}
              width={"min(70vw, 260px)"}
              height={"max(44px, 5vh)"}
            >
              Add Service
            </BrightButton>
          </section>
        </section>

        <section
          id="right"
          className={isAddModalOpen ? "mobileModalOpen" : ""}
          onClick={() => setIsAddModalOpen(false)}
        >
          <section id="modalContent" onClick={(e) => e.stopPropagation()}>
            <section id="modalHeaderRow">
              <BrightHeader headerNumber={2} color={car?.color}>
                Add service for {car?.name}
              </BrightHeader>
              <button
                type="button"
                id="mobileCloseModal"
                className="no-print"
                onClick={() => setIsAddModalOpen(false)}
                aria-label="Close add service modal"
              >
                X
              </button>
            </section>
            <MeterBorder id="formBorder" radius={300} color={car?.color}>
              <MeterScreen>
                <form id="form" onSubmit={handleSubmit}>
                  <h3>Service name:</h3>
                  <BrightInput
                    type="text"
                    id="titleInput"
                    name="title"
                    placeholder="Enter the service done to the car."
                    value={formData.title}
                    onChange={handleChange}
                    color={car?.color}
                    required={true}
                  />
                  <h3>
                    Describe the service <em>(Optional)</em>:
                  </h3>
                  <BrightInput
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Describe the service."
                    value={formData.description}
                    onChange={handleChange}
                    color={car?.color}
                    required={false}
                  />
                  <h3>Date of service:</h3>
                  <BrightInput
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    color={car?.color}
                    required={true}
                  />
                  <h3>Cost:</h3>
                  <BrightInput
                    type="number"
                    id="cost"
                    name="cost"
                    placeholder="Enter the cost of the service."
                    min={0}
                    step={0.01}
                    value={formData.cost}
                    onChange={handleChange}
                    color={car?.color}
                    required={true}
                  />
                  <h3>Current Mileage:</h3>
                  <BrightInput
                    type="number"
                    id="mileage"
                    name="mileage"
                    placeholder="Enter the current mileage of the car."
                    min={0}
                    step={1}
                    value={formData.mileage}
                    onChange={handleChange}
                    color={car?.color}
                    required={true}
                  />
                  <h3>Repeated with time, or with mileage?</h3>
                  <h4>Select neither if this does not need to be repeated.</h4>
                  <section className="checkboxes">
                    <p>Time:</p>
                    <input
                      type="checkbox"
                      id="isTime"
                      name="isTime"
                      checked={formData.isTime}
                      onChange={handleChange}
                    ></input>
                    <p>| Mileage:</p>
                    <input
                      type="checkbox"
                      id="isMileage"
                      name="isMileage"
                      checked={formData.isMileage}
                      onChange={handleChange}
                    ></input>
                  </section>
                  {formData.isTime && (
                    <section>
                      <h3>Time till repeat:</h3>
                      <p id="timeP">
                        This will be used for time based maintenance reminders.
                      </p>
                      <BrightInput
                        type="number"
                        id="nextTime"
                        name="nextTime"
                        min={0}
                        step={1}
                        placeholder="Enter how many months until service repeats. (ex: 3)"
                        value={formData.nextTime}
                        onChange={handleChange}
                        color={car?.color}
                        required={false}
                      />
                    </section>
                  )}
                  {formData.isMileage && (
                    <section>
                      <h3>Miles till repeat:</h3>
                      <p id="mileP">
                        This will be used for mileage based maintenance
                        reminders.
                      </p>
                      <BrightInput
                        type="number"
                        id="nextMileage"
                        name="nextMileage"
                        min={0}
                        step={1}
                        placeholder="Enter how many miles until service repeats."
                        value={formData.nextMileage}
                        onChange={handleChange}
                        color={car?.color}
                        required={false}
                      />
                    </section>
                  )}
                  <h3>Is this maintenance, or is it a repair?</h3>
                  <h4>Select neither if it is neither.</h4>
                  <section className="checkboxes">
                    <p>Maintenance:</p>
                    <input
                      type="checkbox"
                      id="isMaintenance"
                      name="isMaintenance"
                      checked={formData.isMaintenance}
                      onChange={handleChange}
                    ></input>
                    <p>| Repair:</p>
                    <input
                      type="checkbox"
                      id="isRepair"
                      name="isRepair"
                      checked={formData.isRepair}
                      onChange={handleChange}
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
    </section>
  );
}

export default Service;
