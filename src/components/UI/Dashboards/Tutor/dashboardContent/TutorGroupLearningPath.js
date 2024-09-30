import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Divider,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  CircularProgress,
} from "@mui/material";
import Phase from "../../Student/Phase";
import MySnackbar from "../../../MySnackBar";
import { styled } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { getGroupById } from "../../../../../api/getGroupById";
import AnteproyectoComponent from "./AnteproyectoComponente";

// Estilos
const ContainerStyled = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#ffffff",
  marginTop: theme.spacing(5),
  width: "100%",
  height: "100%",
}));

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

const TutorGroupLearningPath = ({ group_id, group }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
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
        console.log("user: ", user);
        console.log("group_id: ", group_id);
        const group = await dispatch(getGroupById(user, group_id));

        setMilestones([
          {
            phase: "Anteproyecto",
            tasks: [
              {
                title: "Entregado",
                completed: group.pre_report_date !== null ? true : false,
              },
              { title: "Aprobado", completed: group.pre_report_approved },
            ],
          },
          {
            phase: "Entrega intermedia",
            tasks: [
              {
                title: "Entregado",
                completed:
                  group.intermediate_assigment_date !== null ? true : false,
              },
              {
                title: "Aprobado",
                completed: group.intermediate_assigment_approved,
              },
            ],
          },
        ]);
      } catch (error) {
        console.error(`Error when getting group ${group_id} by id: `, error);
      } finally {
        setLoading(false); // Termina la carga
      }
    };

    fetchGroupAnswer();
  }, []);

  const handleAnteproyectoClick = () => {
    setSelectedPhase("anteproyecto");
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
            <AnteproyectoComponent groupId={group_id} />
          ) : (
            <>
              {/* Mostrar información del grupo */}
              <Typography
                variant="h4"
                align="center"
                gutterBottom
                marginTop={1}
              >
                Grupo {group_id}
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
                  disabled={!milestones[0]?.tasks[0].completed} // Se deshabilita si no hay pre_report_date
                >
                  Anteproyecto
                </ButtonStyled>

                <ButtonStyled
                  variant="contained"
                  color="primary"
                  disabled={true}
                >
                  Intermedia
                </ButtonStyled>
                <ButtonStyled
                  variant="contained"
                  color="primary"
                  disabled={true}
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

export default TutorGroupLearningPath;
