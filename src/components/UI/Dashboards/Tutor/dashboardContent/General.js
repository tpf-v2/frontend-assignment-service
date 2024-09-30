import React from "react";
import { Box, Typography, Container } from "@mui/material";
import { useSelector } from "react-redux";

const General = () => {
  const user = useSelector((state) => state.user);

  return (
    <Container maxWidth="lg" sx={{ display: "flex", mt: 5 }}>
      <Box sx={{ flex: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Información General
        </Typography>

        <Box mt={4}>
          <Typography variant="body1" gutterBottom>
            Bienvenido al panel de control. En esta página podrás gestionar tus
            actividades y tareas relacionadas con los grupos a los que vas a tutorear. 
            A continuación, se detalla la estructura del panel y cómo
            puedes navegar por las diferentes secciones:
          </Typography>

          <Typography variant="h6" gutterBottom marginTop={2}>
            Barra Lateral (Sidebar)
          </Typography>

          <Typography variant="body1" gutterBottom>
            La barra lateral ubicada en el lado izquierdo de la pantalla te
            permite acceder a diferentes secciones del dashboard:
          </Typography>

          <ul>
            <li>
              <strong>General:</strong> Esta opción te lleva de regreso a esta
              página, donde puedes ver información general y orientaciones sobre
              el uso del dashboard.
            </li>
            <li>
              <strong>Mis Grupos:</strong> Aquí encontrarás una lista de los
              grupos que te han sido asignados. Puedes hacer clic en cada grupo
              para ver detalles específicos y gestionar las tareas
              correspondientes.
            </li>
            <li>
              <strong>Presentaciones:</strong> Esta sección contiene dos
              opciones:
              <ul>
                <li>
                  <strong>Seleccionar disponibilidad:</strong> Utiliza esta
                  opción para elegir tus bloques de disponibilidad. Se te
                  mostrará un calendario en el que podrás seleccionar fechas y
                  horas.
                </li>
                <li>
                  <strong>Fechas de presentación:</strong> Aquí podrás ver y
                  gestionar las fechas de presentación de los trabajos de los
                  grupos.
                </li>
              </ul>
            </li>
          </ul>
        </Box>
      </Box>
    </Container>
  );
};

export default General;
