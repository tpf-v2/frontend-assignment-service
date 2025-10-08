import React from "react";
import { Typography, Link, } from "@mui/material";
import StudentsTable from "../UI/Tables/ChildTables/StudentsTable";
import TeamsTable from "../UI/Tables/ChildTables/GroupsTable";
import TutorsTable from "../UI/Tables/ChildTables/TutorsTable";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from "@mui/icons-material/Error";

import AlgorithmPreCheck from "./AlgorithmPreCheck";

// export const ExpandableData = ({}) => {


// }

// getter auxiliar
const getIcon = (list, externalCondition) => {

    if (!externalCondition) {
        return <ErrorIcon color="error"/>
    }
    if (list.length === 0) {
        return <CheckCircleIcon color="success"/>
    }
    if (list.length > 0) {
        return <WarningAmberIcon color="warning"/>
    }
}

export const IncompleteTeamsPreCheck = ({initialDescription, inputInfo}) => {
  if (inputInfo) {    

    const showWhoList = inputInfo; // por uniformidad / claridad con los demás casos
    const showWhoComponent = <StudentsTable dataListToRender={showWhoList} />;
    const studentsMsg = showWhoList.length === 0 ? "Todos/as los/as estudiantes forman parte de alguna respuesta al formulario."
    : showWhoList.length === 1 ? "Existe 1 estudiante que no está en respuestas al formulario de equipos en ninguna de sus variantes"
    : `Existen ${showWhoList.length} estudiantes que no están en respuestas al formulario de equipos en ninguna de sus variantes`

    const externalCondition = true //    
    const studentsIcon = getIcon(showWhoList, externalCondition);    
    
    // Los dos primeros campos se usan para el modal, el tercero se usa para ver su len y si debería renderizarse el botón
    const expandableData = [{title: studentsMsg, detail: showWhoComponent, infoList: showWhoList, icon: studentsIcon}]
    
    return <AlgorithmPreCheck
      initialDescription={initialDescription}
      expandableData={expandableData}
      condition={true}
      checkResultIcon={studentsIcon}
    />
  } else {
    // AUX )cont): pero poner ese return en el if acá arriba, hace que acá solo haga return en vez de mostrar el
    // spinner. Debería mostrar el spinner acá.
    return;
  }
}

export const DatesPreCheck = ({inputInfo, setSelectedMenu}) => {

    if (inputInfo) {

        const externalCondition = inputInfo.admin_slots;
        
        ///// Equipos        
        const showWhoTeamList = inputInfo.teams;
        const showWhoTeamsComponent = <TeamsTable dataListToRender={showWhoTeamList} />;
        const teamsMsg =
            showWhoTeamList?.length === 0 ? "Todos los equipos completaron su disponibilidad."
          : showWhoTeamList?.length === 1 ? "Existe 1 equipo que no completó su disponibilidad"
          : `Existen ${showWhoTeamList?.length} equipos que no completaron su disponibilidad`
        const teamsIcon = getIcon(showWhoTeamList, externalCondition);        
        
        ///// Tutores
        const showWhoTutorList = inputInfo.teachers;
        const showWhoTutorsComponent = <TutorsTable dataListToRender={showWhoTutorList} />;      
        const tutorsMsg = 
            showWhoTutorList?.length === 0 ? "Todos/as los/as tutores/as completaron su disponibilidad."
          : showWhoTutorList?.length === 1 ? "Existe 1 tutor/a que no completó su disponibilidad"
          : `Existen ${showWhoTutorList?.length} tutores/as que no completaron su disponibilidad`              
        const tutorsIcon = getIcon(showWhoTutorList, externalCondition);
        
        ///// Data
        // Los dos primeros campos se usan para el modal, el tercero se usa para ver su len y si debería renderizarse el botón
        const expandableData = [{title: teamsMsg, detail: showWhoTeamsComponent, infoList: showWhoTeamList, icon: teamsIcon},
                            {title: tutorsMsg, detail: showWhoTutorsComponent, infoList: showWhoTutorList, icon: tutorsIcon}]
        if (!setSelectedMenu) return;

        ///// Mensaje a mostrar si admin no cargó las fechas
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
        return <AlgorithmPreCheck
          expandableData={expandableData}
          condition={externalCondition}
          checkResultIcon={teamsIcon}
          falseConditionMsg={falseConditionMsg}
        />
    }
    
}