import React from "react";
import { Box, Button, Grid } from "@mui/material";
import StatCard from "./StatCard"; // Asegúrate de tener este componente
import BarChartComponent from "./BarChart"; // Asegúrate de tener este componente
import UploadCSVForm from "../../../../Forms/UploadCSVForm"; // Asegúrate de tener este componente
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

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

// Cambia el estilo solo para el botón "VER RESPUESTAS"
// const ViewAnswersButton = styled(Button)(({ theme }) => ({
//   margin: theme.spacing(1),
//   padding: theme.spacing(1.5),
//   width: "48%",
//   fontSize: "1rem",
//   backgroundColor: "#FF5722", // Cambia el color del botón
//   color: "#ffffff",
//   transition: "background-color 0.3s",
//   "&:hover": {
//     backgroundColor: "#E64A19", // Cambia el color en hover
//   },
// }));

const ContentInscripciones = ({
  showUploadCSV,
  setShowUploadCSV,
  uploadType,
  setUploadType,
  dashboardData,
  loading,
  cuatrimestre,
}) => {
  const navigate = useNavigate();

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
                value={loading ? -1 : dashboardData.studentCard}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Total de Tutores"
                value={loading ? -1 : dashboardData.tutorsCard}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Total de Temas"
                value={loading ? -1 : dashboardData.topicsCard}
              />
            </Grid>
          </Grid>
          {/* Centrar el botón "VER RESPUESTAS" */}
          <Box mt={4} display="flex" justifyContent="center">
            <ButtonStyled 
              onClick={() =>
                navigate(`/dashboard/${cuatrimestre}/form-answers`)
              }
            >
              VER RESPUESTAS
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
