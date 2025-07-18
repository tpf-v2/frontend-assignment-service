// Enum en reactjs
export const TableType = Object.freeze({
    STUDENTS: "Alumnos",
    TUTORS: "Tutores",
    TOPICS: "Temas"
});

export const TableTypeSingularLabel = {
    [TableType.STUDENTS]: "alumno",
    [TableType.TUTORS]: "tutor/a",
    [TableType.TOPICS]: "tema",
};