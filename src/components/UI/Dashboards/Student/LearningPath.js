import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import StudentInfo from "./StudentInfo"; // Asegúrate de importar el nuevo componente
import Phase from "./Phase";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getStudentInfo } from "../../../../api/getStudentInfo";
import MySnackbar from "../../MySnackBar";
import { useDispatch } from "react-redux";

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: "100%",
  padding: theme.spacing(1),
  fontSize: "1rem",
  "&.MuiButton-containedPrimary": { backgroundColor: "#0072C6" },
  "&.MuiButton-containedSecondary": { backgroundColor: "#A6A6A6" },
  "&:hover.MuiButton-containedPrimary": { backgroundColor: "#005B9A" },
  "&:hover.MuiButton-containedSecondary": { backgroundColor: "#7A7A7A" },
}));

const LearningPath = () => {
  const dispatch = useDispatch();
  const { cuatrimestre } = useParams();
  const user = useSelector((state) => state.user);
  const [milestones, setMilestones] = useState([]);
  const navigate = useNavigate(); // Hook para navegación
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchGroupAnswer = async () => {
      try {
        const userData = await dispatch(getStudentInfo(user));
  
        setMilestones([
          {
            phase: "Inscripción",
            tasks: [
              { title: "Formulario enviado", completed: userData.form_answered || (userData.topic && userData.tutor) },
              {
                title: "Tema y tutor asignado",
                completed: userData.topic && userData.tutor,
              },
            ],
          },
          // {
          //   phase: 'Anteproyecto',
          //   tasks: [
          //     { title: 'Entrega de video', completed: false },
          //     { title: 'Revisión del tutor', completed: false },
          //   ],
          // },
          // {
          //   phase: 'Entrega Intermedia',
          //   tasks: [
          //     { title: 'Proyecto finalizado', completed: false },
          //     { title: 'Enviar para evaluación', completed: false },
          //   ],
          // },
          // {
          //   phase: 'Presentación',
          //   tasks: [
          //     { title: 'Envio de disponibilidad', completed: false },
          //     { title: 'Fecha de presentación', completed: false },
          //   ],
          // },
        ]);
      } catch (error) {
        console.error("Error al obtener las respuestas", error);
      }
    };

    fetchGroupAnswer();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ display: "flex", mt: 5 }}>
      <Box sx={{ flex: 1, mr: 8, mt: 8 }}>
        {" "}
        {/* Añadir margen superior para centrar con la fase */}
        <StudentInfo />
        <ButtonStyled
          variant="contained"
          color="primary"
          onClick={() => handleNavigation("/student-form")}
        >
          Enviar Formulario de Grupo
        </ButtonStyled>
        {/* <ButtonStyled variant="contained" color="secondary" disabled onClick={() => handleNavigation('/student-form')}>
              Enviar Anteproyecto
            </ButtonStyled>
            <ButtonStyled variant="contained" color="secondary" disabled onClick={() => handleNavigation('/student-form')}>
              Enviar Entrega Intermedia
            </ButtonStyled>
            <ButtonStyled variant="contained" color="secondary" disabled onClick={() => handleNavigation('/student-form')}>
              Enviar Fechas Posibles de Presentación
            </ButtonStyled> */}
      </Box>
      <Box sx={{ flex: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {cuatrimestre || "2C2024"}
        </Typography>
        <Box>
          {milestones.map((phase, index) => (
            <Phase key={index} phase={phase.phase} tasks={phase.tasks} circle={true}/>
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

export default LearningPath;
