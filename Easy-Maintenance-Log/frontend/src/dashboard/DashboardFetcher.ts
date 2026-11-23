import { getCars, type Car } from "../services/cars";
import { getAllServiceForCar, type Service } from "../services/services";

export function fetchCar(): Car[] {
  getCars().then((result) => {
    return result;
  });
  return [];
}

export async function fetchAllServices(cars: Car[]): Promise<Service[]> {
  const servicesPerCar = await Promise.all(
    cars.map((car) => getAllServiceForCar(car.id)),
  );
  return servicesPerCar.flat();
}
