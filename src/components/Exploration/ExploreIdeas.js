import React, { useState, useEffect } from "react";
import { Typography, TextField, Container, Alert } from "@mui/material";
import { useSelector } from "react-redux";
import MySnackbar from "../UI/MySnackBar";
import { Root, Title, ButtonStyled } from "../../components/Root";
import { getPeriodIdeas } from "../../api/ideas";

const ExploreIdeas = () => {
  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.period);

  const [ideas, setIdeas] = useState([]);

  const [submitSuccess, setSubmitSuccess] = useState(false);  
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await getPeriodIdeas(period.id, user);        
        setIdeas(response);
      } catch (error) {
        console.error("Error al obtener las ideas del cuatrimestre", error);
        setNotification({
          open: true,
          message:
            "Error al obtener las ideas del cuatrimestre",
          status: "error",
        });
      }
    };

    fetchIdeas();
  }, [user, period]);

  console.log("--- ideas:", ideas);


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     //setLoading(true);
//     try {
//       const response = await proposeIdea(formData, period.id, user);
//       setSubmitSuccess(true);
//       //setOpenDialog(false);
//     } catch (error) {
//       setNotification({
//         open: true,
//         message: "Error al enviar la idea",
//         status: "error",
//       });
//       console.error("Error al enviar la idea", error);
//     } finally {
//       //setLoading(false)
//     }
//   };

  return (
    <Container maxWidth="md">
      <Root>
        <Title variant="h5" align="center">Ideas</Title>
        <Typography>
        En este espacio se pueden ver las ideas propuestas por estudiantes de este cuatrimestre.
        Se muestra email de autores de las ideas, para facilitar el contacto para el armado de equipos.
        Si obtienen la aprobación de un/a tutor/a, luego pueden completar el formulario de equipos indicando la opción "Ya tengo tema y tutor".
        </Typography>
        {/* Un renderizado re básico (y que no anda) */}
        {ideas?.map((idea) => {
          <>
            <Typography>Título: {idea?.title}</Typography>
            <Typography>Descripción: {idea?.description}</Typography>
            <Typography>Propuesta por: {idea?.student?.email}</Typography>
          </>
        })}
                      
      </Root>
      
      <MySnackbar
        open={notification.open}
        handleClose={handleSnackbarClose}
        message={notification.message}
        status={notification.status}
      />
    </Container>
  );
  
};

export default ExploreIdeas;
