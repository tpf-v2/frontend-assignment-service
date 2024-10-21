import moment from "moment";

export const transformSlotsToIntervals = (slots) => {
  if (slots.length === 0) return [];

  const intervals = [];
  let start = new Date(slots[0].slot);

  for (let i = 1; i < slots.length; i++) {
    const currentSlot = new Date(slots[i].slot);
    const previousSlot = new Date(slots[i - 1].slot);

    // Verificar si el slot actual es una continuación del anterior (1 hora de diferencia)
    const previousEnd = moment(previousSlot);
    const currentStart = moment(currentSlot);

    // Si hay una discontinuidad, significa que terminó el intervalo anterior
    if (!currentStart.isSame(previousEnd.add(1, "hours"))) {
      // Agregar el intervalo actual con el último slot como "end"
      intervals.push({
        start: start,
        end: previousSlot
      });

      start = currentSlot;
    }
  }

  // Asegurar agregar el último intervalo
  intervals.push({
    start: start,
    end: new Date(slots[slots.length - 1].slot)
  });

  return intervals;
};
