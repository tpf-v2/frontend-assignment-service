import React from "react";
import { Grid, Typography, Link, Box, CircularProgress } from "@mui/material";
import StudentsTable from "../UI/Tables/ChildTables/StudentsTable";
import TeamsTable from "../UI/Tables/ChildTables/GroupsTable";
import TutorsTable from "../UI/Tables/ChildTables/TutorsTable";

const AlgorithmPreCheck = ({initialDescription, inputInfo, algorithm, setSelectedMenu}) => {  
  //if (!inputInfo) return;

  let msg;
  let showWhoComponent;
  let showWhoList;

  // Aux tutores mientras pruebo
  let showWhoComponentTutors;
  let showWhoListTutors;
  let msgTutors;

  let condition = true;

  switch (algorithm) {
    case "IncompleteTeams": {

      if (inputInfo) {

        msg = inputInfo.length === 0 ? "Todos/as los/as estudiantes forman parte de alguna respuesta al formulario."
        : inputInfo.length === 1 ? "Existe 1 estudiante que no está en respuestas al formulario de equipos en ninguna de sus variantes:"
        : `Existen ${inputInfo.length} estudiantes que no están en respuestas al formulario de equipos en ninguna de sus variantes:`
  
        showWhoList = inputInfo;
        showWhoComponent = <StudentsTable dataListToRender={showWhoList} />;
  
        // "condition" queda en true (ponerle un mejor nombre)
      }

      break;
    }
    case "Dates": {      

      if (inputInfo) {
        
        condition = inputInfo.admin_slots;
        
        msg =
          inputInfo.teams?.length === 0 ? "Todos los equipos completaron su disponibilidad."
          : inputInfo.teams?.length === 1 ? "Existe 1 equipo que no completó su disponibilidad:"
          : `Existen ${inputInfo.teams?.length} equipos que no completaron su disponibilidad:`
        
        showWhoList = inputInfo.teams;
        showWhoComponent = <TeamsTable dataListToRender={showWhoList} />;
  
        // Tutores
        showWhoListTutors = inputInfo.teachers;
        showWhoComponentTutors = <TutorsTable dataListToRender={showWhoListTutors} />;      
        msgTutors = 
          inputInfo.teachers?.length === 0 ? "Todos/as los/as tutores/as completaron su disponibilidad."
          : inputInfo.teachers?.length === 1 ? "Existe 1 tutor/a que no completó su disponibilidad:"
          : `Existen ${inputInfo.teachers?.length} tutores/as que no completaron su disponibilidad:`      
      }
      
      if (!setSelectedMenu) return;
      
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
    {!inputInfo && (
      <Grid item xs={12} md={12} sx={{ display: "flex" }}>
        <Box
          display="flex"
          minHeight="300px"
        >
          <CircularProgress />
        </Box>
      </Grid>
    )}
    {inputInfo && (
      <>
      <Grid item xs={12} md={12} sx={{ display: "flex" }}>
        <Typography variant="body1" sx={{ textAlign: "justify" }}>
          {initialDescription}
        </Typography>
      </Grid>

      {condition ? (
        <>          
            <>
              <Grid item xs={12} md={12} sx={{ display: "flex" }}>  
                <Typography variant="body1" sx={{ textAlign: "justify" }}>
                  <strong>{msg}</strong>
                </Typography>
              </Grid>      

              {showWhoList?.length > 0 && (
                <Grid item xs={12} md={12} sx={{ display: "flex" }}>
                  {showWhoComponent}
                </Grid>
              )}
            </>
          
            <>
              {/* Tutores - fechas */}
              <Grid item xs={12} md={12} sx={{ display: "flex" }}>  
                <Typography variant="body1" sx={{ textAlign: "justify" }}>
                  <strong>{msgTutors}</strong>
                </Typography>
              </Grid>
              {showWhoListTutors?.length > 0 && (
                <Grid item xs={12} md={12} sx={{ display: "flex" }}>  
                  {showWhoComponentTutors}
                </Grid>
              )}
            </>
        </>
      ) : (
          
          <Grid item xs={12} md={12} sx={{ display: "flex" }}>
            <Typography component={"span"}>
              <strong>Primero se debe cargar las fechas disponibles desde la sección {' '}</strong>
            </Typography>
            <Link
              component="span"
              onClick={() => setSelectedMenu("Disponibilidad fechas de Presentación")}
              underline="always"
              sx={{ color: "blue", cursor: "pointer", ml: 0.5}}
              >
              Disponibilidad fechas de Presentación
            </Link>.
          </Grid>
          )
      }      
      </>
    )}
  </>
);
}

export default AlgorithmPreCheck;
