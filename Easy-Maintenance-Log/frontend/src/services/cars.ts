import api from './api';

export interface Car {
    id: number;
    name: string;
    milage: number;
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
 * Asynchronous function that creates a new car.
 * 
 * @returns Promise of the new car data.
 */
export const createCar = async (carData: Record<string, any>) => {
    const response = await api.post('/cars/', carData);
    return response.data
}

export const updateMilage = async (carID: number, milage: number) => {
    const response = await api.post('/cars/' + carID +'/update_milage/', {milage: milage});
    return response.data
}