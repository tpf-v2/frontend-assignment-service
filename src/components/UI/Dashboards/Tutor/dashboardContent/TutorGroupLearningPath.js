import React, { useEffect, useState } from "react";
import { Container, Box, Typography } from "@mui/material";
import Phase from "../../Student/Phase";
import MySnackbar from "../../../MySnackBar";
import { styled } from "@mui/system";

// Estilos
const ContainerStyled = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#ffffff",
  marginTop: theme.spacing(5),
  width: "100%",
  height: "100%"
}));

const TutorGroupLearningPath = ({ group }) => {
  const [milestones, setMilestones] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  useEffect(() => {
    const fetchGroupAnswer = async () => {
      try {
        setMilestones([
          {
            phase: "Anteproyecto",
            tasks: [
              { title: "Entregado", completed: true },
              { title: "Corregido", completed: true },
            ],
          },
          {
            phase: "Entrega intermedia",
            tasks: [
              { title: "Entregado", completed: true },
              { title: "Corregido", completed: false },
            ],
          },
        ]);
      } catch (error) {
        console.error("Error al obtener las respuestas", error);
      }
    };

    fetchGroupAnswer();
  }, []);

  return (
    <Container maxWidth="lg">
      <ContainerStyled>
        <Typography variant="h4" align="center" gutterBottom>
          {group}
        </Typography>
        <Box>
          {milestones.map((phase, index) => (
            <Phase
              key={index}
              phase={phase.phase}
              tasks={phase.tasks}
              circle={false}
            />
          ))}
        </Box>
      </ContainerStyled>
      <MySnackbar
        open={notification.open}
        handleClose={handleSnackbarClose}
        message={notification.message}
        status={notification.status}
      />
    </Container>
  );
};

export default TutorGroupLearningPath;