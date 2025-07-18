
// Recibe una lista en la que cada elemento es tutor, devuelve una lista 
export const addCapacityToTutors = (tutorsList, period) => {

 return tutorsList.map((item) => { // Agrega capacity a cada tutor
    const selectedTutorPeriod = item.tutor_periods.find(tp => tp.period_id === period.id);
    const capacity = selectedTutorPeriod ? selectedTutorPeriod.capacity : null;
    return {...item, capacity};
  });
}