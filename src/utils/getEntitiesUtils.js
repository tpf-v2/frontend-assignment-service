// El front usa en muchas pantallas funciones getXbyY(), pero está copypasteada una misma función en muchos lugares.
// Este es un archivo de utils, para ir definiendo las funciones comunes y evitar tanto copypaste.
// La idea no es hacer un ctrl+F global, sino ir agregándolas acá y reutilizando a medida que se analiza cada componente,
// para asegurar no romper nada.

export const getTeamById = (id, teams) => { // To-Do: usarla tmb en TopicTutor
    const group = teams?.find((g) => g.id === id);
    return group ? group : null;
};

 // Función para obtener el nombre del tutor por su id
 export const getTutorNameById = (id, periodId, tutors) => {
    const tutor = tutors.find(
      (t) =>
        t.tutor_periods &&
        t.tutor_periods.some((tp) => tp.period_id === periodId && tp.id === id)
    );

    return tutor ? tutor.name + " " + tutor.last_name : "Sin asignar"; // Si no encuentra el tutor, mostrar 'Sin asignar'
};

/// Las dos que siguen son muy parecidas, y actualmente solo se usan en TeamModals para no ensuciar el Autocomplete
/// (existen otros lugares en que se podrían usar también)
// Para TeamModals _ Función para obtener la entidad completa 'tutor' por su tutor_period_id
export const getTutorById = (id, periodId, tutors) => {
    const tutor = tutors.find(
      (t) =>
        t.tutor_periods &&
        t.tutor_periods.some((tp) => tp.period_id === periodId && tp.id === id)
    );

    return tutor;
};
// Para TeamModals _ obtiene Lista de tutores del período indicado
export const getTutorsForPeriod = (periodId, tutors) => {
    return tutors.filter(
      (t) =>
        t.tutor_periods &&
        t.tutor_periods.some((tp) => tp.period_id === periodId)
    );
};
  

export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}
