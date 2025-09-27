// Enum en reactjs
export const TableType = Object.freeze({
    STUDENTS: "Estudiantes",
    TUTORS: "Tutores",
    TOPICS: "Temas",
    RESPONSES: "Respuestas",
    EMBEDDEDNOTITLE: "Embedded no title", // (obs: no sirve ponerle string vacía "")
});

export const TableTypeSingularLabel = {
    [TableType.STUDENTS]: "estudiante",
    [TableType.TUTORS]: "tutor/a",
    [TableType.TOPICS]: "tema",
    [TableType.RESPONSES]: "respuesta",
    [TableType.EMBEDDEDNOTITLE]: "",
};