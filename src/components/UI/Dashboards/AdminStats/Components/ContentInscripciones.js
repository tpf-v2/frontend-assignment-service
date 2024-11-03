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

const ContentInscripciones = ({
  showUploadCSV,
  setShowUploadCSV,
  uploadType,
  setUploadType,
  dashboardData,
  loading,
  period,
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
               CARGAR ALUMNOS
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
                title="Total de Alumnos"
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
