import React, {useState} from "react";
import { Grid, Typography, Link, Box, CircularProgress,
         Dialog, Button, DialogTitle, DialogContent,
         Accordion, AccordionSummary, AccordionDetails, } from "@mui/material";
import StudentsTable from "../UI/Tables/ChildTables/StudentsTable";
import TeamsTable from "../UI/Tables/ChildTables/GroupsTable";
import TutorsTable from "../UI/Tables/ChildTables/TutorsTable";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from "@mui/icons-material/Error";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AlgorithmPreCheck = ({initialDescription, inputInfo, algorithm, setSelectedMenu,
  msg, showWhoComponent, showWhoList, condition, checkResultIcon, expandableData,
  falseConditionMsg
}) => {  

  const [open, setOpen] = useState(false);
  const [data, setData] = useState();

  // let msg;
  // let showWhoComponent;
  // let showWhoList;

  // // Aux tutores mientras pruebo
  let showWhoComponentTutors;
  let showWhoListTutors;
  let msgTutors;

  // let condition = true;

  // let checkResultIcon;

  // let expandableData;

  switch (algorithm) {
    case "IncompleteTeams": {

    //   if (inputInfo && condition!==undefined) {

    //     msg = inputInfo.length === 0 ? "Todos/as los/as estudiantes forman parte de alguna respuesta al formulario."
    //     : inputInfo.length === 1 ? "Existe 1 estudiante que no está en respuestas al formulario de equipos en ninguna de sus variantes"
    //     : `Existen ${inputInfo.length} estudiantes que no están en respuestas al formulario de equipos en ninguna de sus variantes`
  
    //     showWhoList = inputInfo;
    //     showWhoComponent = <StudentsTable dataListToRender={showWhoList} />;

    //     expandableData = [{title: msg, detail: showWhoComponent}]
  
    //     // "condition" queda en true (ponerle un mejor nombre)

    //     // Ícono
    //     checkResultIcon = inputInfo.length === 0
    //     ? <CheckCircleIcon color="success"/> : <WarningAmberIcon color="warning"/>
        
    //     if (!condition) {
    //       checkResultIcon = <ErrorIcon color="error"/>
    //     }

    //   }

      break;
    }
    case "Dates": {  

      // if (inputInfo) {
        
      //   condition = inputInfo.admin_slots;
        
      //   msg =
      //     inputInfo.teams?.length === 0 ? "Todos los equipos completaron su disponibilidad."
      //     : inputInfo.teams?.length === 1 ? "Existe 1 equipo que no completó su disponibilidad"
      //     : `Existen ${inputInfo.teams?.length} equipos que no completaron su disponibilidad`
        
      //   showWhoList = inputInfo.teams;
      //   showWhoComponent = <TeamsTable dataListToRender={showWhoList} />;


      //   // Ícono
      //   checkResultIcon = inputInfo.length === 0
      //   ? <CheckCircleIcon color="success"/> : <WarningAmberIcon color="warning"/>
        
      //   if (!condition) {
      //     checkResultIcon = checkResultIcon = <ErrorIcon color="error"/>
      //   }

      //   //////////
      //   // Tutores
      //   const showWhoListTutors = inputInfo.teachers;
      //   const showWhoComponentTutors = <TutorsTable dataListToRender={showWhoListTutors} />;      
      //   const msgTutors = 
      //     inputInfo.teachers?.length === 0 ? "Todos/as los/as tutores/as completaron su disponibilidad."
      //     : inputInfo.teachers?.length === 1 ? "Existe 1 tutor/a que no completó su disponibilidad"
      //     : `Existen ${inputInfo.teachers?.length} tutores/as que no completaron su disponibilidad`      
      // }
      


      // expandableData = [{title: msg, detail: showWhoComponent},
      //                   {title: msgTutors, detail: showWhoComponentTutors}
      // ]
      // if (!setSelectedMenu) return;
      
      break;
    }
    default: {
      console.log("Error, valor no esperado de algorithm:", algorithm);
      msg = "Ocurrió un error inesperado al mostrar información";
    }
  }

  // Nop, esto siempre da true -_-
  // if (condition === undefined) {
  //   return
  // }
  console.log("--- condition:", condition);

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
              <Grid item xs={12} md={12} sx={{ display: "flex", gap: 0.5}}>  
                {checkResultIcon}
                <Typography variant="body1" sx={{ textAlign: "justify" }}>
                  <strong>{msg}</strong>
                </Typography>
              </Grid>

              {/* Éste no va */}
              {false && showWhoList?.length > 0 && (
                <Grid item xs={12} md={12} sx={{ display: "flex" }}>
                  {showWhoComponent}
                </Grid>
              )}
              {/* Va éste. y hay que reutilizar cosas acá, el "inputInfo" es lo variable */}
              {inputInfo.length > 0 && condition && (
                <Typography variant="body1" sx={{ textAlign: "justify" }}>
                  <Button
                    variant="outlined"
                    onClick={() => {setData(expandableData); setOpen(true)}}
                  >
                    Analizar
                  </Button>

                </Typography>
              )}
            </>
          
            <>
              {/* Tutores - fechas */}
              <Grid item xs={12} md={12} sx={{ display: "flex" }}>  
                <Typography variant="body1" sx={{ textAlign: "justify" }}>
                  <strong>{msgTutors}</strong>
                </Typography>
              </Grid>
              {false && showWhoListTutors?.length > 0 && (
                <Grid item xs={12} md={12} sx={{ display: "flex" }}>  
                  {showWhoComponentTutors}
                </Grid>
              )}

               {/* Va éste. veamosssssssss _ en realidad no del todo pero probando __ y hay que reutilizar cosas acá, el "inputInfo" es lo variable */}
               {inputInfo.teachers?.length > 0 && condition && (
                <Typography variant="body1" sx={{ textAlign: "justify" }}>
                  <Button
                    variant="outlined"
                    onClick={() => {setData(expandableData); setOpen(true)}}
                  >
                    Analizar
                  </Button>

                </Typography>
              )}
            
            </>
        </>
      ) : (
          
          <Grid item xs={12} md={12} sx={{ display: "flex", gap: 0.5 }}>
            {checkResultIcon}
            {falseConditionMsg}
          </Grid>
          )
      }      
      </>
    )}


  <Dialog open={open} onClose={() => {setOpen(false)}} maxWidth={false}>
    <DialogTitle>Entidades con problemas</DialogTitle>
    <DialogContent>
      {data?.map((e, index) => (
        <Accordion key={index} defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              <strong>{e.title}</strong>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">{e.detail}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </DialogContent>
          
  </Dialog>

  </>
);
}

export default AlgorithmPreCheck;

    // <Grid item xs={12} md={12} sx={{ display: "flex" }}>
    //   {showWhoComponent}
    // </Grid>