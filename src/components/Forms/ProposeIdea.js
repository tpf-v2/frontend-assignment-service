import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { getTopics } from "../../api/handleTopics"; // Aux: sobra
import { useSelector } from "react-redux";
import MySnackbar from "../UI/MySnackBar";
import ClosedAlert from "../ClosedAlert"; // Ahora se conserva, en el futuro no existirá

const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
}));

const ProposeIdea = () => {
  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.period);

  //full_team: false,
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    student_id: user.id,
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);  
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await getTopics(period.id, user);
        const topics = response.data.filter(
          (c) => c.category.name !== "default"
        ).sort((a, b) => a.name.localeCompare(b.name)); // Sorting alphabetically;
        //setTopics(topics);
      } catch (error) {
        console.error("Error al obtener los topics", error);
        setNotification({
          open: true,
          message:
            "Error al obtener los temas. Por favor contactar al administrador",
          status: "error",
        });
      }
    };

    fetchTopics();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();    
  };

  const handleConfirm = async () => {
    setLoading(true);    
    try {
      //const response = await sendGroupForm(period.id, payload, existingGroup, user);
      const response = 201;
      if (response.status === 201) {
        setSubmitSuccess(true);
        //setOpenDialog(false);
      } else {
        setNotification({
          open: true,
          message: response.data.detail,
          status: "error",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "Error al enviar el formulario",
        status: "error",
      });
      console.error("Error al enviar el formulario", error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <Container maxWidth="sm">
      {period.form_active ? (
        <Root>
          <Title variant="h5">Proponer Idea</Title>
          {submitSuccess && (
            <Alert severity="success">
              Gracias por proponer la idea.
            </Alert>
          )}
          {!submitSuccess && (
            <form onSubmit={handleSubmit}>
              {/* Ya tengo tema y tutor */}
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
                    rows={4}   // altura inicial
                    required
                  />
                </>
              )}
  
              <ButtonStyled variant="contained" color="primary" type="submit">
                Enviar Formulario
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
