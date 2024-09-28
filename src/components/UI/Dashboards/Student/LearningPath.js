import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { Container, Box, Typography } from "@mui/material";

import MySnackbar from "../../MySnackBar";
import SubmitButton  from "../../SubmitButton";
import StudentInfo from "./StudentInfo";
import Phase from "./Phase";

import { getStudentInfo } from "../../../../api/getStudentInfo";
import { getGroupById } from "../../../../api/getGroupById"

const LearningPath = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const cuatrimestre = useSelector((state) => state.user.period_id);

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
        const userData = await dispatch(getStudentInfo(user));
        const group = await getGroupById(user.group_id);

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
          {
            phase: 'Anteproyecto',
            tasks: [
              { title: 'Entrega de archivo', completed: group.pre_report_date !== null ? true : false },
              { title: 'Revisión del tutor', completed: group.pre_report_approved },
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
      <Box sx={{ flex: 1, mr: 8, mt: 8 }}>
        {" "}
        {/* Añadir margen superior para centrar con la fase */}
        <StudentInfo />
        <SubmitButton url="/student-form" title="Enviar Formulario de Grupo"/>
        <SubmitButton url="/initial-project" title="Enviar Anteproyecto"/>
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
