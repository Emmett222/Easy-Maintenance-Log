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
 * Asynchronous function that creates a new car.
 * 
 * @returns Promise of the new car data.
 */
export const createCar = async (carData: Record<string, any>) => {
    const response = await api.post('/cars/', carData);
    return response.data
}