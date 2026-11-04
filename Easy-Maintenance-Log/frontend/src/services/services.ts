import api from './api';
import type { Car } from './cars';

export interface Service {
    id: number;
    car: Car;
    title: string;
    milage: Number;
    date: Date;
    cost: Number;

    next_milage: Number;
    next_time: Number;
    milage_dependant: Number;
    time_dependant: Number;
}

/**
 * Asynchronous function that gets all of the services for a given car.
 * 
 * @param carID The ID for the car in String form.
 * @returns Promise of the array of all the cars.
 */
export const getAllServiceForCar = async (carID: number): Promise<Service[]> => {
    const response = await api.get<Service[]>('/services/' + carID + '/');
    return response.data;
}

/**
 * Asynchronous function that creates a service record for a car.
 * 
 * @param carID The ID for the car in String form.
 * @param serviceData The service details in a record with string and any.
 * @returns Promise of the new car data.
 */
export const createService = async (carID: number, serviceData: Record<string, any>) => {
    const response = await api.post('/services/' + carID + '/', serviceData);
    return response.data
}