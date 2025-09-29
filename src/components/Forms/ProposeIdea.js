import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";
import MySnackbar from "../UI/MySnackBar";
import ClosedAlert from "../ClosedAlert"; // Ahora se conserva, en el futuro no existirá
import { proposeIdea } from "../../api/ideas";

const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: "block", // con esta prop + marginLeft se ajusta el botón a la derecha
  marginLeft: "auto",
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
}));

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      {period.form_active ? (
        <Root>
          <Title variant="h5" align="center">Proponer Idea</Title>
          <Typography>
            En este espacio podés proponer una idea. Será visible por estudiantes y tutores de este cuatrimestre.
            Esto puede utilizarse para que te contacten estudiantes a quienes les interese tu idea y así poder formar equipo.
            Si obtienen la aprobación de un/a tutor/a, luego pueden completar el formulario de equipos indicando la opción "Ya tengo tema y tutor".
          </Typography>
          {/* Con el esquema de bool y !bool casos exluyentes, cambiamos lo mostrado en pantalla */}
          {submitSuccess && (
            <Alert severity="success">
              Gracias por proponer la idea.
            </Alert>
          )}
          {!submitSuccess && (
            <form onSubmit={handleSubmit}>
              {(
                <>
                  <TextField
                    label="Título"
                    name="title" // para manejar de manera genérica el e.target.value con handleChange
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    label="Descripción"
                    name="description"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    minrows={5}   // altura inicial
                    maxRows={15}  // se expande hasta esta altura (luego scroll)
                    required
                  />
                </>
              )}
  
              <ButtonStyled variant="contained" color="primary" type="submit" align="right">
                Enviar
              </ButtonStyled>
            </form>
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
