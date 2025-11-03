import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Container, Box, CircularProgress } from "@mui/material";
import MySnackbar from "../../components/UI/MySnackBar";
import StudentInfo from "../../components/UI/Dashboards/Student/StudentInfo";
import Phase from "../../components/UI/Dashboards/Student/Phase";
import { getStudentInfo } from "../../api/handleStudents";
import { getGroupById } from "../../api/getGroupById";
import { useNavigate } from "react-router-dom";
import { getPeriodById } from "../../api/handlePeriods";
import { setPeriod } from "../../redux/slices/periodSlice";
import PresentationDateCard from "../../components/UI/Dashboards/Student/PresentationDateCard";
import StudentSidebar from "./StudentSidebar";
import { ClosedErrorAlert } from "../../components/ClosedErrorAlert";

const StudentHomeView = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.period);
 
  const [milestones, setMilestones] = useState([]);
  const [infoError, setInfoError] = useState(false);
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
        let team = {};
        if (userData.group_id !== 0) {
          team = await dispatch(getGroupById(user, userData.group_id));
        }
        
        setTeam(team);
        const form_completed = userData.form_answered || (userData.topic && userData.tutor);
        const topic_completed = userData.topic && userData.tutor;
        setMilestones([
          // completed: marcar visualmente como completado, notar que se relaciona con el title
          // available: permitirle ingresar (relacionado con el toggle de admin)
          // url completed y not completed: se puede llevar a distintas pantallas al clickear dependiendo de completed
          {
            phase: "Formulario de Inscripción",
            description: topic_completed ? "Tema y tutor asignado" : "Tema sin asignar",
            tasks: [
              {
                title: form_completed ? "Formulario enviado" : "Enviar formulario",
                completed: form_completed,
                available: period.form_active,
                urlNotCompleted: "/student-form",
                urlCompleted:"",
              },  
            ],
          },
          {
            phase: "Anteproyecto",
            description: team.pre_report_approved ? "Entrega aprobada" : "Revisión de tutor pendiente",
            tasks: [
              {
                title: !team.pre_report_date ? (period.initial_project_active ? "Enviar" : "No disponible") : (period.initial_project_active ? "Cambiar entrega" : "Enviado") ,
                completed: !!team.pre_report_date,
                available: period.initial_project_active && !!user.group_id,
                urlNotCompleted: "/upload/initial-project",
                urlCompleted: "/upload/initial-project"
              },
            ],
          },
          {
            phase: "Entrega Intermedia",
            tasks: [
              {
                title: !team.intermediate_assigment_date ? (period.intermediate_project_active ? "Enviar" : "No disponible") : (period.intermediate_project_active ? "Cambiar entrega" : "Enviada") ,
                completed: !!team.intermediate_assigment_date,
                available: period.intermediate_project_active && !!user.group_id,
                urlNotCompleted: "/upload/intermediate-project",
                urlCompleted: "/upload/intermediate-project"
              },
            ],
          },
          {
            phase: "Entrega Final",
            tasks: [
              {
                title: !team.final_report_date ? (period.final_project_active ? "Enviar" : "No disponible") :  (period.final_project_active ? "Cambiar entrega" : "Enviada"),
                completed: !!team.final_report_date,
                available: period.final_project_active && !!user.group_id,
                urlNotCompleted: "/upload/final-project",
                urlCompleted: "/upload/final-project"
              }
            ],
          },
          {
            phase: "Exposición de Proyecto Final",
            tasks: [
              {
                //title: team.loaded_date_availability ? "Cambiar disponibilidad de fechas" : "Enviar disponibilidad de fechas",
                title: period.presentation_dates_available
                  ? (team.loaded_date_availability ? "Cambiar disponibilidad de fechas" : "Enviar disponibilidad de fechas")
                  : (team.loaded_date_availability ? "Disponibilidad de fechas enviada" : "No disponible"),
                completed: team.loaded_date_availability,
                available: period.presentation_dates_available && !!user.group_id,
                urlNotCompleted: "/availability-view",
                urlCompleted: "/availability-view"
              },
            ],
          }/*,
          {
            phase: "Informe de Cumplimiento PPS",
            tasks: [
              {
                title: !userData.pps_report_date ? (!!period.pps_report_active ? "Enviar" : "No disponible") : "Enviado",
                completed: !!userData.pps_report_date,
                available: period.pps_report_active && !!user.group_id,
                urlNotCompleted: "/upload/pps-report",
                urlCompleted: "/upload/pps-report"
              }
            ],
          }*/
        ]);
      } catch (error) {
        console.error("Error al obtener las respuestas", error);
        setInfoError(true);
      } finally {
        if (!!period) {
          setLoading(false);
        } // Finalizar la carga de datos
      }
    };

    fetchTeamAnswer();
  }, [dispatch, user, period]);

  const navigate = useNavigate();
  const handleNavigation = (url) => {
    navigate(url);
  };

  return (
    <Container maxWidth="lg" sx={{ display: "flex", mt: 5 }}>
      <Box sx={{ flex: 1, mr: 8, mt: 8 }}>
        {/* Recuadro con info de compañeros tema y tutor; "Tu equipo expondrá/expuso el _" - Tarjeta desplegable */}
        <StudentInfo infoError={infoError}/>
        <Box sx={{ mb: 1 }} />
        {!loading && team.exhibition_date && <PresentationDateCard presentationDate={team.exhibition_date}/>}
        {!loading && (
          <StudentSidebar selectedMenu={null} handleNavigation={handleNavigation}/>
        )}
      </Box>
      <Box sx={{ flex: 2 }}>
        <Box>
          {loading ? ( // Mostrar CircularProgress si está cargando
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress /> {/* Spinner de carga */}
            </Box>
          ) : (
            <>  
              {infoError &&
                <ClosedErrorAlert message={`Ocurrió un error al obtener los datos.
                Si el problema persiste, contactar a la administración.`}/>
              }
              {milestones.map((phase, index) => (
                <Phase
                  key={index}
                  phase={phase.phase}
                  tasks={phase.tasks}
                  description={phase.description}
                  circle={true}
                />
              ))}
            </>
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
