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

export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}
