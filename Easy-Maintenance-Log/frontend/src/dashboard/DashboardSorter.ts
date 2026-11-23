import type { Service } from "../services/services";
import formatDateString from "../util/stringUtil";

/**
 * Picks out the mileage based services and sorts them.
 *
 * @param services The services array to sort.
 * @returns An array of services sorted by which is soonest based on mileage.
 */
export function sortMileage(services: Service[]): Service[] {
  return services
    .filter((curr) => curr.mileage_dependant)
    .sort(
      (a, b) =>
        a.mileage +
        a.next_mileage -
        a.car_current_mileage -
        (b.mileage + b.next_mileage - b.car_current_mileage),
    );
}

/**
 * Picks out the time based services and sorts them.
 *
 * @param services The services array to sort.
 * @returns An array of services sorted by which is soonest based on time.
 */
export function sortTime(services: Service[]): Service[] {
  return services
    .filter((curr) => curr.time_dependant)
    .sort(
      (a, b) =>
        new Date(formatDateString(a.date, a.next_time)).getTime() -
        new Date(formatDateString(b.date, b.next_time)).getTime(),
    );
}
