import moment from "moment";
import { CalendarInterval } from "../components/CalendarInterval";

  /**
   * Revisa si este intervalo está estrictamente dentro de ISOAvailableDates.
   * @param {ISOAvailableDates} ISOAvailableDates lista de strings de fecha en formato ISO
   */
export const transformSlotsToIntervals = (slots) => {
  if (slots.length === 0) return [];

  const sortedSlots = slots.sort((a, b) => new Date(a.slot) - new Date(b.slot));
  let start = new Date(sortedSlots[0].slot);

  const intervals = [];

  for (let i = 1; i < sortedSlots.length; i++) {
    const previousSlot = new Date(sortedSlots[i - 1].slot);
    const currentSlot = new Date(sortedSlots[i].slot);

    // Final del intervalo anterior (1 hora después del anterior slot)
    const endOfCurrentInterval = moment(previousSlot).add(1, "hours");
    const startOfNextInterval = moment(currentSlot);

    const intervalsConnected = startOfNextInterval.diff(endOfCurrentInterval) === 0;
    // Si no son contiguos, terminamos el intervalo anterior
    if (!intervalsConnected) {
      const interval = new CalendarInterval(start, endOfCurrentInterval.toDate())
      intervals.push(interval);

      // Reiniciamos el inicio del siguiente intervalo
      start = currentSlot;
    }
  }

  // Aseguramos que se agregue el último intervalo
  const finalSlot = new Date(sortedSlots[sortedSlots.length - 1].slot)
  const end = moment(finalSlot).add(1, "hours")
  const interval = new CalendarInterval(start, end.toDate())
  intervals.push(interval);

  return intervals;
};

export function fixTimezoneForSlots(slots) {
  slots = slots.map(slot => {
    return {
      ...slot,
      slot: fixTimezone(new Date(slot.slot))
    };
  });
  return slots;
}

function fixTimezone(date) {
  return moment(date + 'Z').add(3, "hours").toDate().toISOString();
}

