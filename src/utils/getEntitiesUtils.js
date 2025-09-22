// El front usa en muchas pantallas funciones getXbyY(), pero está copypasteada una misma función en muchos lugares.
// Este es un archivo de utils, para ir definiendo las funciones comunes y evitar tanto copypaste.
// La idea no es hacer un ctrl+F global, sino ir agregándolas acá y reutilizando a medida que se analiza cada componente,
// para asegurar no romper nada.

export const getTeamById = (id, teams) => { // To-Do: usarla tmb en TopicTutor
    const group = teams?.find((g) => g.id === id);
    return group ? group : null;
};
