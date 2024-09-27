import React from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import Phase from "../Student/Phase";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import MySnackbar from "../../MySnackBar";

const TutorGroupLearningPath = ({group}) => {
  const user = useSelector((state) => state.user);
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
              { title: "Enviado", completed: true},
              {
                title: "Corregido",
                completed: true,
              },
            ],
          },
          {
            phase: "Entrega intermedia",
            tasks: [
              { title: "Enviado", completed: true},
              {
                title: "Corregido",
                completed: false,
              },
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
    <Container maxWidth="lg" sx={{ display: "flex", mt: 5 }}>
      <Box sx={{ flex: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {group}
        </Typography>
        <Box>
          {milestones.map((phase, index) => (
            <Phase key={index} phase={phase.phase} tasks={phase.tasks} circle={false} />
          ))}
        </Box>
      </Box>
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
