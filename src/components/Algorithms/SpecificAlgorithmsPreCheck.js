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

import AlgorithmPreCheck from "./AlgorithmPreCheck";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const IncompleteTeamsPreCheck = ({initialDescription, inputInfo, algorithm, setSelectedMenu}) => {
  if (inputInfo) {
    // A ESTE LO TRAIGO DE AFUERA:
    // const preCheckMsg = `Este algoritmo utiliza las respuestas al formulario de equipos`+    
    //     ` (Preferencias / Ya tengo tema y tutor) como input, para completar los equipos en base a sus preferencias.`
    // ^ SE LLAMA INITIAL DESCRIPTION ACÁ, igual se puede traer para adentro dsp

    const msg = inputInfo.length === 0 ? "Todos/as los/as estudiantes forman parte de alguna respuesta al formulario."
    : inputInfo.length === 1 ? "Existe 1 estudiante que no está en respuestas al formulario de equipos en ninguna de sus variantes"
    : `Existen ${inputInfo.length} estudiantes que no están en respuestas al formulario de equipos en ninguna de sus variantes`

    const showWhoList = inputInfo;
    const showWhoComponent = <StudentsTable dataListToRender={showWhoList} />;

    const expandableData = [{title: msg, detail: showWhoComponent}]

    const condition = true //(ponerle un mejor nombre)

    // Ícono
    let checkResultIcon = inputInfo.length === 0
    ? <CheckCircleIcon color="success"/> : <WarningAmberIcon color="warning"/>
    
    if (!condition) {
      checkResultIcon = <ErrorIcon color="error"/>
    }

    console.log("--- condition a pasar:", condition);
    
    // AUX: esto debe ir acá xq afuera del if no existen las variables que le estoy pasando
    // Aux: Equipos incompletos no lleva set :)
    return <AlgorithmPreCheck initialDescription={initialDescription} inputInfo={inputInfo} algorithm={"IncompleteTeams"}
          msg={msg} showWhoList={inputInfo} showWhoComponent={showWhoComponent}
          expandableData={expandableData} condition={true} checkResultIcon={checkResultIcon}
          falseConditionMsg={"Dev error"} />
  } else {
    // AUX )cont): pero poner ese return en el if acá arriba, hace que acá solo haga return en vez de mostrar el
    // spinner. Debería mostrar el spinner acá.
    return;
  }
}

export const DatesPreCheck = ({initialDescription, inputInfo, algorithm, setSelectedMenu}) => {

    if (inputInfo) {
        
        const condition = inputInfo.admin_slots;
        
        const msg =
          inputInfo.teams?.length === 0 ? "Todos los equipos completaron su disponibilidad."
          : inputInfo.teams?.length === 1 ? "Existe 1 equipo que no completó su disponibilidad"
          : `Existen ${inputInfo.teams?.length} equipos que no completaron su disponibilidad`
        
        const showWhoList = inputInfo.teams;
        const showWhoComponent = <TeamsTable dataListToRender={showWhoList} />;

        // Ícono
        let checkResultIcon = inputInfo.length === 0
        ? <CheckCircleIcon color="success"/> : <WarningAmberIcon color="warning"/>        
        if (!condition) {
          checkResultIcon = checkResultIcon = <ErrorIcon color="error"/>
        }

        //////////
        // Tutores
        const showWhoListTutors = inputInfo.teachers;
        const showWhoComponentTutors = <TutorsTable dataListToRender={showWhoListTutors} />;      
        const msgTutors = 
          inputInfo.teachers?.length === 0 ? "Todos/as los/as tutores/as completaron su disponibilidad."
          : inputInfo.teachers?.length === 1 ? "Existe 1 tutor/a que no completó su disponibilidad"
          : `Existen ${inputInfo.teachers?.length} tutores/as que no completaron su disponibilidad`      
        
        
        const expandableData = [{title: msg, detail: showWhoComponent},
                            {title: msgTutors, detail: showWhoComponentTutors}
        ]
        if (!setSelectedMenu) return;




        /////
        const falseConditionMsg = (
            <>
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
            </>
        );

        // AUX hay que ponerle un map para pasarle más de un msg... o algo así, ver.
        return <AlgorithmPreCheck inputInfo={inputInfo} algorithm={"IncompleteTeams"}
          msg={msg} showWhoList={inputInfo?.teams} showWhoComponent={showWhoComponent}
          expandableData={expandableData} condition={condition} checkResultIcon={checkResultIcon}
          falseConditionMsg={falseConditionMsg} />
    }
    

   

}