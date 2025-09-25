import React from "react";
import { Grid, Typography } from "@mui/material";
import StudentsTable from "../UI/Tables/ChildTables/StudentsTable";

const AlgorithmPreCheck = ({initialDescription, inputInfo, algorithm}) => {  
  if (!inputInfo) return;

  let msg;
  switch (algorithm) {
    case "IncompleteTeams": {
      msg = inputInfo.length === 0 ? "Todos/as los/as estudiantes forman parte de alguna respuesta al formulario."
      : inputInfo.length === 1 ? "Existe 1 estudiante que no está en respuestas al formulario de equipos en ninguna de sus variantes."
      : `Existen ${inputInfo.length} estudiantes que no están en respuestas al formulario de equipos en ninguna de sus variantes.`

      break;
    }
    case "Dates": {
      msg = inputInfo.length === 0 ? "Todos los equipos completaron su disponibilidad."
      : inputInfo.length === 1 ? "Existe 1 equipo que no completó su disponibilidad."
      : `Existen ${inputInfo.length} equipos que no completaron su disponibilidad.`

      break;
    }
    default: {
      console.log("Error, valor no esperado de algorithm:", algorithm);
      msg = "Ocurrió un error inesperado al mostrar información";
    }
  }

  return (
    <>
    <Grid item xs={12} md={12} sx={{ display: "flex" }}>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Verificación previa
      </Typography>
    </Grid>
    {inputInfo && (
      <>
      <Grid item xs={12} md={12} sx={{ display: "flex" }}>
        <Typography variant="body1" sx={{ textAlign: "justify" }}>
          {initialDescription}
        </Typography>
      </Grid>
      <Grid item xs={12} md={12} sx={{ display: "flex" }}>  
        <Typography variant="body1" sx={{ textAlign: "justify" }}>
          {msg}
        </Typography>
      </Grid>

      {/* VER dónde poner esto, lo pongo acá para probar
        - Poner esto acá va a obviamente romper el caso de fechas (que igual no mostraba nada)
          solo estoy probando */}
      <Grid item xs={12} md={12} sx={{ display: "flex" }}>  
        <Typography variant="body1" sx={{ textAlign: "justify" }}>
          Quiénes son
          <StudentsTable dataListToRender={inputInfo} />
      
        </Typography>
      </Grid>
      </>
    )}
  </>
);
}

export default AlgorithmPreCheck;
