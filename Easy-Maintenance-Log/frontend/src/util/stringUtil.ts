/**
 * Formats a given date from the database into a more terse date. Can also add months if needed.
 *
 * @param date
 * @param addTime
 */
export default function formatDateString(
  date: Date,
  addMonths: number = 0,
): string {
  const newDate = new Date(date);
  newDate.setUTCMonth(newDate.getUTCMonth() + addMonths);

  const formattedDate = newDate.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  return formattedDate;
}
