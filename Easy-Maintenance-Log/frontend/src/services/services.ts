import api from './api';
import type { Car } from './cars';

export interface Service {
    id: number;
    car: Car;
    car_name: string;
    car_current_mileage: number;
    title: string;
    mileage: number;
    date: Date;
    cost: number;

    next_mileage: number;
    next_time: number;
    mileage_dependant: boolean;
    time_dependant: boolean;
}

/**
 * Asynchronous function that gets all of the services for a given car.
 * 
 * @param carID The ID for the car in String form.
 * @returns Promise of the array of all the cars.
 */
export const getAllServiceForCar = async (carID: number): Promise<Service[]> => {
    const response = await api.get<Service[]>('/services/?car_id=' + carID);
    return response.data;
}

/**
 * Asynchronous function that creates a service record for a car.
 * 
 * @param serviceData The service details in a record with string and any.
 * @returns Promise of the new car data.
 */
export const createService = async (serviceData: Record<string, any>) => {
    const response = await api.post('/services/', serviceData);
    return response.data;
}

/**
 * Asynchronous function that deletes a service for a car.
 * 
 * @param ID The ID of the service.
 */
export const deleteServiceByID = async (serviceID: number) => {
    const response = await api.delete('/services/' + serviceID + '/');
    return response.data;
}