import React, { useState, useEffect } from "react";
import { Typography, TextField, Container, Alert, Box, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import MySnackbar from "../UI/MySnackBar";
import { Root, Title, ButtonStyled } from "../../components/Root";
import { getPeriodIdeas } from "../../api/ideas";

const ExploreIdeas = () => {
  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.period);

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [user, period]);

  console.log("--- ideas:", ideas);

  if (loading)
    return (
        <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
        >
        <CircularProgress />
        </Box>
  );

  return (
    <Container maxWidth="md">
      <Root>
        <Title variant="h5" align="center">Ideas</Title>
        <Typography>
        En este espacio se pueden ver las ideas propuestas por estudiantes de este cuatrimestre.
        Se muestra email de autores de las ideas, para facilitar el contacto para el armado de equipos.
        Si obtienen la aprobación de un/a tutor/a, luego pueden completar el formulario de equipos indicando la opción "Ya tengo tema y tutor".
        </Typography>
        {/* Un renderizado de ideas mejorable */}        
        {ideas?.map((idea) => (
          <Box key={idea?.id} sx={{ mb: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>

            <Typography variant="subtitle1" fontWeight="bold">
              Título: {idea?.title}
            </Typography>
            <Typography variant="body1">Descripción: {idea?.description}</Typography>
            
            <Typography variant="body2">
              Propuesta por: {idea?.student?.name} {idea?.student?.last_name} ({idea?.student?.email})
            </Typography>
            <Typography variant="body2">
              Equipo: {idea?.full_team ? "Completo" : "Aún buscando integrantes"}
            </Typography>
          </Box>        
        ))}
                      
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
