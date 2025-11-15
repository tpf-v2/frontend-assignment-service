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
  
  const getTeamFormPhase = (team, is_form_completed, is_topic_assigned) => {
    const tasks = [];
    let notDoneMsg = undefined;

    if (period.form_active) { // fecha activa (toggle admin activado)
      tasks.push({
        title: is_form_completed ? "Formulario enviado" : "Enviar formulario",
        completed: is_form_completed,
        available: period.form_active,
        urlNotCompleted: "/student-form",
        urlCompleted:"",
      });
    } else {
      notDoneMsg = "No enviado.";
    }

    return {
      phase: "Formulario de Inscripción",
      description: is_topic_assigned ? "Tema y tutor asignado" : "Tema sin asignar",
      tasks: tasks,
      notDoneMsg: notDoneMsg,
    }
  }

  // Existen 4 combinaciones de sí/no toggle fecha de entrega activo y sí/no entrega realizada.
  const getAnteproyectoPhase = (team) => {
    let tasks = [];
    let notDoneMsg = undefined;

    if (!!team.pre_report_date) { // Siempre que haya entregado, no importa si fecha activa o no
      // Botón ver (Nuevo!)
      tasks.push({
        title: "Ver Entrega", // No hay título condicional, solo quiero appendearlo si sí entregó
        completed: !!team.pre_report_date,
        available: !!user.group_id,
        urlNotCompleted: "/upload/initial-project",
        urlCompleted: "/upload/initial-project"
      });
    }
    if (period.initial_project_active) { // fecha activa (toggle admin activado)
      // Botón Enviar o Cambiar entrega
      tasks.push({
        title: !team.pre_report_date ? (period.initial_project_active ? "Enviar" : "No disponible") : (period.initial_project_active ? "Cambiar entrega" : "Enviado") ,
        completed: !!team.pre_report_date,
        available: period.initial_project_active && !!user.group_id,
        urlNotCompleted: "/upload/initial-project",
        urlCompleted: "/upload/initial-project"
      });
    } else {
      notDoneMsg = "No enviado.";
    }

    return ({
      phase: "Anteproyecto",
      description: team.pre_report_approved ? "Entrega aprobada" : "Revisión de tutor pendiente",
      tasks: tasks,
      notDoneMsg: notDoneMsg,
    })
  };


  const getIntermediateOrFinalPhase = (team) => {
    let tasks = [];
    let notDoneMsg = undefined;

    if (!!team.intermediate_assigment_date) { // Siempre que haya entregado, no importa si fecha activa o no
      // Botón ver (Nuevo!)
      tasks.push({
        title: "Ver Entrega", // No hay título condicional, solo quiero appendearlo si sí entregó
        completed: !!team.intermediate_assigment_date,
        available: !!user.group_id,
        urlNotCompleted: "/upload/intermediate-project",
        urlCompleted: "/upload/intermediate-project"
      });
    }
    if (period.intermediate_project_active) { // fecha activa (toggle admin activado)
      // Botón Enviar o Cambiar entrega
      tasks.push({
        title: !team.intermediate_assigment_date ? (period.intermediate_project_active ? "Enviar" : "No disponible") : (period.intermediate_project_active ? "Cambiar entrega" : "Enviada") ,
        completed: !!team.intermediate_assigment_date,
        available: period.intermediate_project_active && !!user.group_id,
        urlNotCompleted: "/upload/intermediate-project",
        urlCompleted: "/upload/intermediate-project"
      });     
    } else {
      notDoneMsg = "No enviada.";
    }

    return ({
      phase: "Entrega Intermedia",
      tasks: tasks,
      notDoneMsg: notDoneMsg,
    })
  };

  const getFinalDeliveryPhase = (fetchedTeam) => {
    let tasks = [];
    let notDoneMsg = undefined;

    if (!!fetchedTeam.final_report_date) { // Siempre que haya entregado, no importa si fecha activa o no
      // Botón ver (Nuevo!)
      tasks.push({
        title: "Ver Entrega", // No hay título condicional, solo quiero appendearlo si sí entregó
        completed: !!fetchedTeam.final_report_date,
        available: !!user.group_id,
        urlNotCompleted: "/upload/final-project",
        urlCompleted: "/upload/final-project"
      });
    }
    if (period.final_project_active) { // fecha activa (toggle admin activado)
      // Botón Enviar o Cambiar entrega
      tasks.push({
        title: !fetchedTeam.final_report_date ? (period.final_project_active ? "Enviar" : "No disponible") :  (period.final_project_active ? "Cambiar entrega" : "Enviada"),
        completed: !!fetchedTeam.final_report_date,
        available: period.final_project_active && !!user.group_id,
        urlNotCompleted: "/upload/final-project",
        urlCompleted: "/upload/final-project"
      });     
    } else {
      notDoneMsg = "No enviada.";
    }

    return ({
        phase: "Entrega Final",
        tasks: tasks,
        notDoneMsg: notDoneMsg,
    })
  };
  
  useEffect(() => {
    const fetchTeamAnswer = async () => {
      try {
        const userData = await dispatch(getStudentInfo(user));
        let fetchedTeam = {};
        if (userData.group_id !== 0) {
          fetchedTeam = await dispatch(getGroupById(user, userData.group_id));
        }
        
        setTeam(fetchedTeam);
        const form_completed = userData.form_answered || (userData.topic && userData.tutor);
        const topic_completed = userData.topic && userData.tutor;
        //const milestonesToSet = {};

        setMilestones([
          // completed: marcar visualmente como completado, notar que se relaciona con el title
          // available: permitirle ingresar (relacionado con el toggle de admin)
          // url completed y not completed: se puede llevar a distintas pantallas al clickear dependiendo de completed
            getTeamFormPhase(fetchedTeam, form_completed, topic_completed)
          ,          
            getAnteproyectoPhase(fetchedTeam)
          ,
            getIntermediateOrFinalPhase(fetchedTeam)
          ,
            getFinalDeliveryPhase(fetchedTeam)
          ,
          {
            phase: "Exposición de Proyecto Final",
            tasks: [
              {
                title: period.presentation_dates_available
                  ? (fetchedTeam.loaded_date_availability ? "Cambiar disponibilidad de fechas" : "Enviar disponibilidad de fechas")
                  : (fetchedTeam.loaded_date_availability ? "Disponibilidad de fechas enviada" : "No disponible"),
                completed: fetchedTeam.loaded_date_availability,
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

  console.log("--- milestones:", milestones);

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
                  notDoneMsg={phase.notDoneMsg}
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
