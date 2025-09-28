
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Container, Box, CircularProgress } from "@mui/material";
import MySnackbar from "../../components/UI/MySnackBar";
import SubmitButton from "../../components/Buttons/SubmitButton";
import StudentInfo from "../../components/UI/Dashboards/Student/StudentInfo";
import Phase from "../../components/UI/Dashboards/Student/Phase";
import { getStudentInfo } from "../../api/handleStudents";
import { getGroupById } from "../../api/getGroupById";
import { useNavigate } from "react-router-dom";
import { getPeriodById } from "../../api/handlePeriods";
import { setPeriod } from "../../redux/slices/periodSlice";
import PresentationDateCard from "../../components/UI/Dashboards/Student/PresentationDateCard";

const StudentHomeView = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.user.period_id);
 
  const [milestones, setMilestones] = useState([]);
  const [team, setTeam] = useState({});
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
    const fetchTeamAnswer = async () => {
      try {
        const userData = await dispatch(getStudentInfo(user));

        console.log("--- user.id:", user.id);
        console.log("--- userData:", userData);
        
        let team = {};
        if (userData.group_id !== 0) {
          team = await dispatch(getGroupById(user, userData.group_id));
        }
        
        setTeam(team);
        const form_completed = userData.form_answered || (userData.topic && userData.tutor)
        const topic_completed = userData.topic && userData.tutor
        setMilestones([
          {
            phase: "Inscripción",
            tasks: [
              {
                title: form_completed ? "Formulario enviado" : "Formulario no enviado",
                completed: form_completed,
              },
              {
                title: topic_completed ? "Tema y tutor asignado" : "Tema sin asignar",
                completed: topic_completed,
              },
              
            ],
          },
          {
            phase: "Anteproyecto",
            tasks: [
              {
                title: !!team.pre_report_date ? "Enviado" : "No enviado",
                completed: !!team.pre_report_date,
              },
              {
                title: team.pre_report_approved ?  "Revisión terminada" : "Revisión de tutor",
                completed: team.pre_report_approved,
              },
            ],
          },
          {
            phase: "Entrega Intermedia",
            tasks: [
              {
                title: !!team.intermediate_assigment_date ? "Enviada" : "No enviada",
                completed:
                  !!team.intermediate_assigment_date,
              },
            ],
          },
          {
            phase: "Entrega Final",
            tasks: [
              {
                title: !!team.final_report_date ? "Enviada" : "No enviada",
                completed: !!team.final_report_date,
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

    fetchTeamAnswer();
  }, [dispatch, user]);

  const navigate = useNavigate();
  const handleNavigation = (url) => {
    navigate(url);
  };

  return (
    <Container maxWidth="lg" sx={{ display: "flex", mt: 5 }}>
      <Box sx={{ flex: 1, mr: 8, mt: 8 }}>
        <StudentInfo />
        <Box sx={{ mb: 1 }} />
        {!loading && team.exhibition_date && <PresentationDateCard presentationDate={team.exhibition_date}/>}
        {!loading && (
          <>
            {/* AUX PROBANDO: este primer botón no va a ir acá, solo estoy probando */}
            <SubmitButton
              url="/propose-idea"
              title="Proponer Idea"
              width="100%"
              handleSubmit={() => handleNavigation("/propose-idea")}
              disabled={!milestones[0]?.tasks[0].completed}
            />
            <SubmitButton
              url="/student-form"
              title="Enviar Formulario de Equipo"
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
              disabled={!period.presentation_dates_available}
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
