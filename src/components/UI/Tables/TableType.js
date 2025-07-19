// Enum en reactjs
export const TableType = Object.freeze({
    STUDENTS: "Estudiantes",
    TUTORS: "Tutores",
    TOPICS: "Temas"
});

export const TableTypeSingularLabel = {
    [TableType.STUDENTS]: "estudiante",
    [TableType.TUTORS]: "tutor/a",
    [TableType.TOPICS]: "tema",
};