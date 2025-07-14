import React from "react";
import { Box, Button, Grid } from "@mui/material";
import StatCard from "./StatCard"; // Asegúrate de tener este componente
import BarChartComponent from "./BarChart"; // Asegúrate de tener este componente
import UploadCSVForm from "../../../../Forms/UploadCSVForm"; // Asegúrate de tener este componente
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ButtonStyled = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  width: "48%",
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  backgroundColor: "#0072C6",
  color: "#ffffff",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: "#005B9A",
  },
}));

const ContentInscripciones = ({
  showUploadCSV,
  setShowUploadCSV,
  uploadType,
  setUploadType,
  dashboardData,
  students,
  tutors,
  topics,
  loading,
  period,
}) => {
  const navigate = useNavigate();
  const studentsLength = Object.keys(students).filter(key => key !== '_persist').length;
  const tutorsLength = Object.keys(tutors).filter(key => key !== '_persist').length;
  const topicsLength = Object.keys(topics).filter(key => key !== '_persist').length;
  const groups = Object.values(useSelector((state) => state.groups))
  .map(({ version, rehydrated, ...rest }) => rest)
  .filter((item) => Object.keys(item).length > 0);
  // Filtrar los grupos sin preferencia de tema
  if (groups.length > 0){
    const groupsWithoutPreferredTopics = groups?.filter(group => !group.preferred_topics || group.preferred_topics.length === 0);

    // Contar la cantidad de estudiantes en estos grupos y agregarlos a las categorías correspondientes
    groupsWithoutPreferredTopics.forEach(group => {
      const numStudents = group.students.length;
  
      // Verificar el número de estudiantes y agregar al gráfico
      if (numStudents === 1) {
        dashboardData.answersChart[0].cantidad += 1; // Grupos con 1 estudiante
      } else if (numStudents === 2) {
        dashboardData.answersChart[1].cantidad += 1; // Grupos con 2 estudiantes
      } else if (numStudents === 3) {
        dashboardData.answersChart[2].cantidad += 1; // Grupos con 3 estudiantes
      } else if (numStudents === 4) {
        dashboardData.answersChart[3].cantidad += 1; // Grupos con 4 estudiantes
      }
    });
  }


  return (
    <>
      {showUploadCSV && <UploadCSVForm formType={uploadType} />}
      {!showUploadCSV && (
        <>
          <Box
            mt={2}
            display="flex"
            justifyContent="space-between"
            width="100%"
          >
            <ButtonStyled
              onClick={() => {
                setUploadType("students");
                setShowUploadCSV(true);
              }}
            >
               CARGAR ESTUDIANTES
            </ButtonStyled>
            <ButtonStyled
              onClick={() => {
                setUploadType("tutors");
                setShowUploadCSV(true);
              }}
            >
               CARGAR TUTORES
            </ButtonStyled>
            <ButtonStyled
              onClick={() => {
                setUploadType("topics");
                setShowUploadCSV(true);
              }}
            >
               CARGAR TEMAS
            </ButtonStyled>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Total de Estudiantes"
                value={loading ? -1 : studentsLength}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Total de Tutores"
                value={loading ? -1 : tutorsLength}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Total de Temas"
                value={loading ? -1 : topicsLength}
              />
            </Grid>
          </Grid>
          {/* Centrar el botón " RESPUESTAS" */}
          <Box mt={4} display="flex" justifyContent="center">
            <ButtonStyled 
              onClick={() =>
                navigate(`/dashboard/${period}/form-answers`)
              }
            >
               RESPUESTAS
            </ButtonStyled>
          </Box>{" "}
          <Box mt={2}>
            {!loading && (
              <BarChartComponent data={dashboardData.answersChart} />
            )}
          </Box>
        </>
      )}
    </>
  );
};

export default ContentInscripciones;
