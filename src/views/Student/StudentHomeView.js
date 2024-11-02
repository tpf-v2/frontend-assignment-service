
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Container, Box, Typography, CircularProgress } from "@mui/material"; // Importar CircularProgress
import MySnackbar from "../../components/UI/MySnackBar";
import SubmitButton from "../../components/Buttons/SubmitButton";
import StudentInfo from "../../components/UI/Dashboards/Student/StudentInfo";
import Phase from "../../components/UI/Dashboards/Student/Phase";
import { getStudentInfo } from "../../api/handleStudents";
import { getGroupById } from "../../api/getGroupById";
import { useNavigate } from "react-router-dom";
import { getPeriodById } from "../../api/handlePeriods";
import { setPeriod } from "../../redux/slices/periodSlice";

const StudentHomeView = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.user.period_id);

  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  useEffect(() => {
    const fetchPeriod = async () => {
      if (user && user.id) {
        try {
          const period = await getPeriodById(user);
          dispatch(setPeriod(period));
        } catch (error) {
          console.error("Error when getting period: ", error);
        }
      }
    };

    fetchPeriod();
  }, [user, dispatch]);

  useEffect(() => {
    const fetchGroupAnswer = async () => {
      try {
        const userData = await dispatch(getStudentInfo(user));
        console.log(userData);

        let group = {};
        if (userData.group_id !== 0) {
          group = await dispatch(getGroupById(user, userData.group_id));
        }

        setMilestones([
          {
            phase: "Inscripción",
            tasks: [
              {
                title: "Formulario enviado",
                completed:
                  userData.form_answered || (userData.topic && userData.tutor),
              },
              {
                title: "Tema y tutor asignado",
                completed: userData.topic && userData.tutor,
              },
            ],
          },
          {
            phase: "Anteproyecto",
            tasks: [
              {
                title: "Entrega de archivo",
                completed: !!group.pre_report_date,
              },
              {
                title: "Revisión de un tutor",
                completed: group.pre_report_approved,
              },
            ],
          },
          {
            phase: "Entrega Intermedia",
            tasks: [
              {
                title: "Entregado",
                completed:
                  group.intermediate_assigment_date !== null ? true : false,
              },
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
        console.error("Error al obtener las respuestas", error);
      } finally {
        setLoading(false); // Finalizar la carga de datos
      }
    };

    fetchGroupAnswer();
  }, [dispatch, user]);

  const navigate = useNavigate();
  const handleNavigation = (url) => {
    navigate(url);
  };

  return (
    <Container maxWidth="lg" sx={{ display: "flex", mt: 5 }}>
      <Box sx={{ flex: 1, mr: 8, mt: 8 }}>
        <StudentInfo />
        {!loading && (
          <>
            <SubmitButton
              url="/student-form"
              title="Enviar Formulario de Grupo"
              width="100%"
              handleSubmit={() => handleNavigation("/student-form")}
              disabled={!milestones[0]?.tasks[0].completed}
            />
            <SubmitButton
              url="/upload/initial-project"
              title="Enviar Anteproyecto"
              width="100%"
              handleSubmit={() => handleNavigation("/upload/initial-project")}
              disabled={!milestones[1]?.tasks[0].completed}
            />
            <SubmitButton
              url="/upload/intermediate-project"
              title="Enviar Entrega Intermedia"
              width="100%"
              handleSubmit={() =>
                handleNavigation("/upload/intermediate-project")
              }
              disabled={!milestones[2]?.tasks[0].completed}
            />
            <SubmitButton
              url="/availability-view"
              title="Disponibilidades de Exposición"
              width="100%"
              handleSubmit={() => handleNavigation("/availability-view")}
            />
            <SubmitButton
              url="/upload/final-project"
              title="Enviar Entrega Final"
              width="100%"
              handleSubmit={() => handleNavigation("/upload/final-project")}
              disabled={!milestones[3]?.tasks[0].completed}
            />
          </>
        )}
      </Box>
      <Box sx={{ flex: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {period}
        </Typography>
        <Box>
          {loading ? ( // Mostrar CircularProgress si está cargando
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress /> {/* Spinner de carga */}
            </Box>
          ) : (
            milestones.map((phase, index) => (
              <Phase
                key={index}
                phase={phase.phase}
                tasks={phase.tasks}
                circle={true}
              />
            ))
          )}
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

export default StudentHomeView;
