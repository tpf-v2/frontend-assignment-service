import React, { useState } from "react";
import { Typography, TextField, Container, Alert } from "@mui/material";
import { useSelector } from "react-redux";
import MySnackbar from "../UI/MySnackBar";
import ClosedAlert from "../ClosedAlert"; // Ahora se conserva, en el futuro no existirá
import { proposeIdea } from "../../api/ideas";
import { Root, Title, ButtonStyled } from "../../components/Root";
import { WriteIdea } from "./WriteIdea";

const ProposeIdea = () => {
  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.period);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    student_id: user.id,
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);  
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //setLoading(true);
    try {
      const response = await proposeIdea(formData, period.id, user);
      setSubmitSuccess(true);
      //setOpenDialog(false);
    } catch (error) {
      setNotification({
        open: true,
        message: "Error al enviar la idea",
        status: "error",
      });
      console.error("Error al enviar la idea", error);
    } finally {
      //setLoading(false)
    }
  };

  return (
    <Container maxWidth="md">
      {period.form_active ? ( // <-- [VER] qué condición poner acá. No habría que dep de toggles, quizás algoritmo temas (o equipos) no ejecutado
        <Root>
          <Title variant="h5" align="center">Proponer Idea</Title>
          <Typography>
            En este espacio se puede proponer una idea. Será visible por estudiantes y tutores de este cuatrimestre.
            Esto puede utilizarse para que te contacten estudiantes a quienes les interese tu idea y así poder formar equipo.
            Si se obtiene la aprobación de un/a tutor/a, luego, de querer elegirla se debe completar el formulario de equipos
            indicando la opción "Ya tengo tema y tutor".
          </Typography>
          {/* Con el esquema de bool y !bool casos exluyentes, cambiamos lo mostrado en pantalla */}
          {submitSuccess && (
            <Alert severity="success">
              Gracias por proponer la idea.
            </Alert>
          )}
          {!submitSuccess && (
            <WriteIdea handleSubmit={handleSubmit} formData={formData} setFormData={setFormData} />
          )}
          
        </Root>
      ) : (
        <ClosedAlert message="No se aceptan más propuestas de ideas." />
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

export default ProposeIdea;
