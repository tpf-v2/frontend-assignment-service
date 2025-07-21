import moment from "moment";
import { CalendarInterval } from "../components/CalendarInterval";

export const transformSlotsToIntervals = (slots) => {
  if (slots.length === 0) return [];

  slots = fixTimezoneInSlots(slots);
  // Ordenamos los slots cronológicamente
  const sortedSlots = slots.sort((a, b) => new Date(a.slot) - new Date(b.slot));

  const intervals = [];
  let start = new Date(sortedSlots[0].slot);

  for (let i = 1; i < sortedSlots.length; i++) {
    const currentSlot = new Date(sortedSlots[i].slot);
    const previousSlot = new Date(sortedSlots[i - 1].slot);

    // Final del intervalo anterior (1 hora después del anterior slot)
    const previousEnd = moment(previousSlot).add(1, "hours");
    const currentStart = moment(currentSlot);

    // Verificar si la diferencia es exactamente 0 (es decir, que son contiguos)
    if (currentStart.diff(previousEnd) !== 0) {
      // Si no son contiguos, terminamos el intervalo anterior
      intervals.push(new CalendarInterval(start, previousEnd.toDate()))
      start = currentSlot;
    }
  }

  // Aseguramos que se agregue el último intervalo
  const lastSlot = new Date(sortedSlots[sortedSlots.length - 1].slot)
  const lastIntervalEnd = moment(lastSlot).add(1, "hours").toDate()
  intervals.push(new CalendarInterval(start, lastIntervalEnd));
  return intervals;
};

export function fixTimezoneInSlots(slots) {

  slots = slots.map(slot => {
    return {
      ...slot,
      slot: fixTimezone(new Date(slot.slot))
    };
  });
  return slots;
}

export function fixTimezone(date) {
  return date
}