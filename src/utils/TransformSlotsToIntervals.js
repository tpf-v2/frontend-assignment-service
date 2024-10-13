import moment from "moment";

export const transformSlotsToIntervals = (slots) => {
  if (slots.length === 0) return [];

  const intervals = [];
  let start = slots[0].slot; // El primer slot es el inicio del primer intervalo

  for (let i = 1; i < slots.length; i++) {
    const currentSlot = slots[i].slot;
    const previousSlot = slots[i - 1].slot;

    // Verificar si el slot actual es una continuación del anterior (por ejemplo, 1 hora de diferencia)
    const previousEnd = moment(previousSlot);
    const currentStart = moment(currentSlot);
    
    // Si hay una discontinuidad, significa que terminó el intervalo anterior
    if (!currentStart.isSame(previousEnd.add(1, "hours"))) {
      // Agregar el intervalo actual con el último slot como "end"
      intervals.push({
        start: start,
        end: previousSlot
      });

      // Actualizar el inicio del nuevo intervalo
      start = currentSlot;
    }
  }

  // Asegurar agregar el último intervalo
  intervals.push({
    start: start,
    end: slots[slots.length - 1].slot
  });

  return intervals;
};
