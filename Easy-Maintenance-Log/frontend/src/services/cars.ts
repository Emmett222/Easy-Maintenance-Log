import api from './api';

export interface Car {
    id: number;
    name: string;
    mileage: number;
    color: string;
}

/**
 * Asynchronous function that gets all the cars.
 * 
 * @returns Promise of the array of all the cars.
 */
export const getCars = async (): Promise<Car[]> => {
    const response = await api.get<Car[]>('/cars/');
    return response.data;
}

/**
 * Asynchronous function that gets one car by ID.
 * 
 * @param carID The ID of the car wanted.
 * @returns Promise of the car wanted.
 */
export const getCarByID = async (carID: number): Promise<Car> => {
    const response = await api.get<Car>('/cars/' + carID);
    return response.data;
}

/**
 * Asynchronous function that deletes one car by ID.
 * 
 * @param carID The ID of the car wanted.
 */
export const deleteCarByID = async (carID: number) => {
    await api.delete<Car>('/cars/' + carID + '/');
}

/**
 * Asynchronous function that creates a new car.
 * 
 * @returns Promise of the new car data.
 */
export const createCar = async (carData: Record<string, any>) => {
    const response = await api.post('/cars/', carData);
    return response.data
}

/**
 * Asynchronous function that updates the mileage of a car.
 * 
 * @param carID The ID of the car wanted.
 * @param mileage The new mileage of the car.
 */
export const updateMileage = async (carID: number, mileage: number) => {
    const response = await api.patch('/cars/' + carID +'/update_mileage/', {mileage: mileage});
    return response.data
}

/**
 * Asynchronous function that renames one car.
 * 
 * @param carID The ID of the car wanted.
 * @param name The new name of the car.
 */
export const updateName = async (carID: number, name: string) => {
    const response = await api.patch('/cars/' + carID +'/update_name/', {name: name});
    return response.data
}

/**
 * Asynchronous function that changes the color of one car.
 * 
 * @param carID The ID of the car wanted.
 * @param color The new color of the car.
 */
export const updateColor = async (carID: number, color: string) => {
    const response = await api.patch('/cars/' + carID +'/update_color/', {color: color});
    return response.data
}