import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Divider,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";

import Phase from "./UI/Dashboards/Student/Phase";
import MySnackbar from "./UI/MySnackBar";
import ProjectPdfComponent from "./UI/Dashboards/Tutor/ProjectPdfComponent";
import TutorIntermediateProjectComponent from "./UI/Dashboards/Tutor/TutorIntermediateProjectComponent"; // Importar el componente
import { getGroupById } from "../api/getGroupById";
import GroupReview from "./UI/Dashboards/Tutor/GroupReview";

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  position: "relative",
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  width: "38%",
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  backgroundColor: "#0072C6",
  color: "#ffffff",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: "#005B9A",
  },
}));

const LearningPath = ({ group_id, group }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const [selectedPhase, setSelectedPhase] = useState(null);

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  useEffect(() => {
    const fetchGroupAnswer = async () => {
      try {
        const group = await dispatch(getGroupById(user, group_id));

        setMilestones([
          {
            phase: "Anteproyecto",
            tasks: [
              {
                title: "Entregado",
                completed: group.pre_report_date !== null ? true : false,
              },
              { title: "Revisado", completed: group.pre_report_approved },
            ],
          },
          {
            phase: "Entrega Intermedia",
            tasks: [
              {
                title: "Entregado",
                completed: group.intermediate_assigment_date !== null ? true : false,
              }
            ],
          },
          {
            phase: "Entrega Final",
            tasks: [
              {
                title: "Entregado",
                completed: group.final_report_date !== null ? true : false,
              }
            ],
          },
        ]);
      } catch (error) {
        console.error(`Error when getting group ${group_id} by id: `, error);
      } finally {
        setLoading(false); 
      }
    };

    fetchGroupAnswer();
  }, []);

  const handleAnteproyectoClick = () => {
    setSelectedPhase("anteproyecto");
  };

  const handleIntermediateProjectClick = () => {
    setSelectedPhase("intermediate");
  };

  const handleFinalProjectClick = () => {
    setSelectedPhase("final");
  };
  
  return (
    <Container maxWidth="lg">
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {selectedPhase === "anteproyecto" ? (
            <GroupReview group={group}/>
          ) : selectedPhase === "intermediate" ? ( 
            <TutorIntermediateProjectComponent groupId={group_id} /> 
          ) : selectedPhase === "final" ? ( 
            <ProjectPdfComponent groupId={group_id} groupNumber={group.group_number} projectType={"Final"}/> 
          ) : (
            // Título de la sección
            <>              
              <Typography
                variant="h4"
                align="center"
                gutterBottom
                marginTop={1}
              >
                Equipo {group.group_number}
              </Typography>
              <StyledCard>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" gutterBottom>
                        Estudiantes
                      </Typography>
                      {group?.students.map((student) => (
                        <Box key={student.id} marginBottom={1}>
                          <Typography variant="body2">
                            <strong>
                              {student.name} {student.last_name}
                            </strong>{" "}
                            - {student.email}
                          </Typography>
                        </Box>
                      ))}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" gutterBottom>
                        Tema
                      </Typography>
                      <Typography variant="body1">
                        <strong>
                          {group?.topic.name || "Tema no asignado"}
                        </strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </StyledCard>

              <Divider sx={{ marginY: 3 }} />

              <Typography variant="h5" gutterBottom>
                Entregas
              </Typography>
              <Box display="flex" justifyContent="space-between" width="100%">
                <ButtonStyled
                  variant="contained"
                  color="primary"
                  onClick={handleAnteproyectoClick}
                  disabled={!milestones[0]?.tasks[0].completed} 
                >
                  Anteproyecto
                </ButtonStyled>

                <ButtonStyled
                  variant="contained"
                  color="primary"
                  onClick={handleIntermediateProjectClick} 
                  disabled={!milestones[1]?.tasks[0].completed} 
                >
                  Intermedia
                </ButtonStyled>
                <ButtonStyled
                  variant="contained"
                  color="primary"
                  onClick={handleFinalProjectClick} 
                  disabled={!milestones[2]?.tasks[0].completed}
                >
                  Final
                </ButtonStyled>
              </Box>

              <Divider sx={{ marginY: 3 }} />
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
            </>
          )}
        </>
      )}
      <MySnackbar
        open={notification.open}
        handleClose={handleSnackbarClose}
        message={notification.message}
        status={notification.status}
      />
    </Container>
  );
};

export default LearningPath;
