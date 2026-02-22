
// Usado para indicarle al ConfirmDeleteModal quién le solicita eliminar, para adaptar el mensaje a mostrar en consecuencia
export const DELETE_MSG_FOR = Object.freeze({
  ADMIN: "admin",
  ADMIN_EDIT_MODE: "admin-edit-mode", // al ejecutar el algoritmo, viendo el pop up -> "Editar" es modo de edición
  NON_ADMIN_ROLES: "non-admin", // estudiantes, tutores (y evaluadores, que es subconjunto de tutores)
});

// Usado para indicarle al EventModal quién le solicita agregar, para adaptar el mensaje a mostrar en consecuencia
export const ADD_MSG_FOR = Object.freeze({
  ADMIN: "admin",
  NON_ADMIN_ROLES: "non-admin", // estudiantes, tutores (y evaluadores, que es subconjunto de tutores)
});