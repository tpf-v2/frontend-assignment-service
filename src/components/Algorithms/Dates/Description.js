import React from "react";
import { Grid, Typography } from "@mui/material";

const Description = () => (
  <>
    <Grid item xs={12} md={12} sx={{ display: "flex" }}>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Descripción
      </Typography>
    </Grid>
    <Grid item xs={12} md={12} sx={{ display: "flex" }}>
      <Typography variant="body1" sx={{ textAlign: "justify" }}>
        Este algoritmo emplea programación lineal para asignar fechas de
        presentación a equipos de estudiantes, considerando la disponibilidad de
        tutores y evaluadores. Su objetivo es garantizar que todos los equipos
        reciban una fecha de exposición dentro del rango disponible. Además, el
        algoritmo distribuye equitativamente la carga de trabajo entre los
        evaluadores, asegurando una asignación justa y balanceada.
      </Typography>
    </Grid>
  </>
);

export default Description;
