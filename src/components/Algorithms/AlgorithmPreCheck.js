import React from "react";
import { Grid, Typography, Link } from "@mui/material";
import StudentsTable from "../UI/Tables/ChildTables/StudentsTable";
import TeamsTable from "../UI/Tables/ChildTables/GroupsTable";

const AlgorithmPreCheck = ({initialDescription, inputInfo, algorithm, setSelectedMenu}) => {  
  if (!inputInfo) return;  

  let msg;
  let showWhoComponent;
  let showWhoList;
  switch (algorithm) {
    case "IncompleteTeams": {
      msg = inputInfo.length === 0 ? "Todos/as los/as estudiantes forman parte de alguna respuesta al formulario."
      : inputInfo.length === 1 ? "Existe 1 estudiante que no está en respuestas al formulario de equipos en ninguna de sus variantes:"
      : `Existen ${inputInfo.length} estudiantes que no están en respuestas al formulario de equipos en ninguna de sus variantes:`

      showWhoList = inputInfo;
      showWhoComponent = <StudentsTable dataListToRender={showWhoList} />;

      break;
    }
    case "Dates": {
      if (!setSelectedMenu) return;
      
      msg = inputInfo.admin_slots ? (
        inputInfo.teams?.length === 0 ? "Todos los equipos completaron su disponibilidad."
        : inputInfo.teams?.length === 1 ? "Existe 1 equipo que no completó su disponibilidad:"
        : `Existen ${inputInfo.teams?.length} equipos que no completaron su disponibilidad:`
      ) : (
        <>
          Primero se debe cargar las fechas disponibles desde la sección {""}
          <Link
            component="span"
            onClick={() => setSelectedMenu("Disponibilidad fechas de Presentación")}
            underline="always"
            sx={{ color: "blue", cursor: "pointer"}}
            >
            Disponibilidad fechas de Presentación
          </Link>.
        </>
        )
      
      showWhoList = inputInfo.teams;
      showWhoComponent = <TeamsTable dataListToRender={showWhoList} />;      
      
      break;
    }
    default: {
      console.log("Error, valor no esperado de algorithm:", algorithm);
      msg = "Ocurrió un error inesperado al mostrar información";
    }
  }

  console.log("--- inputInfo:", inputInfo);

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

      {showWhoList.length > 0 && (<Grid item xs={12} md={12} sx={{ display: "flex" }}>  
        {showWhoComponent}
      </Grid>)}
      </>
    )}
  </>
);
}

export default AlgorithmPreCheck;
