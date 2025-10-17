import { useState } from "react";
import {
  Typography,
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
import { WriteIdeaFields } from "./WriteIdeaFields";

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
            <Alert severity="success" sx={{ mt: 2 }}>
              Gracias por proponer la idea.
            </Alert>
          )}
          {!submitSuccess && (
            <form onSubmit={handleSubmit}>
              
              <WriteIdeaFields data={formData} setData={setFormData} />
              
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
