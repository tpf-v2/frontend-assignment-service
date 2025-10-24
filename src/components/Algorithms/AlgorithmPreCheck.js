import { useState } from "react";
import { Grid, Typography, CircularProgress, Box,
         Dialog, Button, DialogTitle, DialogContent,
         Accordion, AccordionSummary, AccordionDetails, 
         DialogActions} from "@mui/material";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from "@mui/icons-material/Error";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Componente auxiliar para mostrar el título con el spinner mientras carga
export const Title = ({withSpinner=false}) => {
  const spinner = () => (
    <Grid item xs={12} md={12} sx={{ display: "flex" }}>
      <Box
        display="flex"
        minHeight="300px"
      >
        <CircularProgress />
      </Box>
    </Grid>
  )

  return (
    <>
      <Grid item xs={12} md={12} sx={{ display: "flex" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Verificación previa
        </Typography>      
      </Grid>
      {withSpinner && (
        spinner()
      )}
    </>
  )
}

// Componente genérico, recibe los datos ya procesados de SpecificAlgorithmsPreCheck.js
// les agrega íconos y se encarga del renderizado. Muestra a admin que hay entidades con problemas
// (ej estudiantes / equipos / tutores que faltan al input de los algoritmos) y en un modal
// muestra quiénes son.
export const AlgorithmPreCheck = ({
  initialDescription,
  condition=true,
  expandableData,
  falseConditionMsg
}) => {  

  const [open, setOpen] = useState(false);
  const [data, setData] = useState();

  const getIcon = (list) => {
    if (list.length === 0) {
        return <CheckCircleIcon color="success"/>
    }
    if (list.length > 0) {        
        return <WarningAmberIcon color="warning"/>
    }
  }
  
  // Agregamos ícono a cada mensaje a mostrar
  const dataWithIcons = expandableData?.map(elem => ({ ...elem, icon: getIcon(elem.infoList) }));
  
  // True si alguna de las listas muestra 'entidades problemáticas', para saber si debo mostrar el botón de "Analizar"
  const areThereProblems = expandableData?.some(element => element.infoList.length > 0);

  return (
    <>
    <Title />    
    {dataWithIcons && (
      <>
      <Grid item xs={12} md={12} sx={{ display: "flex" }}>
        <Typography variant="body1" sx={{ textAlign: "justify" }}>
          {initialDescription}
        </Typography>
      </Grid>

      {condition ? (
        <>
        {/* Muestro lista de cada msj (ej "Existen _n_ ... que no ...", o msj de Todo ok) con su ícono*/}
          {dataWithIcons?.map((okMsgOrProblematicEntity) => (
            <Grid item xs={12} md={12} sx={{ display: "flex", gap: 0.5}}>  
              {okMsgOrProblematicEntity.icon}
              <Typography variant="body1" sx={{ textAlign: "justify" }}>
                <strong>{okMsgOrProblematicEntity.title}</strong>
              </Typography>
            </Grid>
          ))}
          {/* Si hay gente que falte al input, y aplica mostrar, muestro botón para ver quiénes son en modal */}
          {areThereProblems && condition && (    
            <Grid
              item
              xs={12}
              md={falseConditionMsg ? 12 : 11}
              sx={{ display: "flex", justifyContent: "right" }}
            >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {setData(dataWithIcons); setOpen(true)}}
              sx={{ ml: "auto", mt: "auto",
                padding: falseConditionMsg ? "6px 19px" : "6px 9px", // Tamaño del botón para coincidir visualmente con el de "Correr"
               }} // ml empuja hacia la derecha (al gap lo maneja el último de la derecha)
            >
              Analizar
            </Button> 
            </Grid>           
          )}
          </>
      ) : (
        <Grid item xs={12} md={12} sx={{ display: "flex", gap: 0.5 }}>
          {/* Si esto es false, no aplica mostrarlos xq existe otro problema ("primero admin cargar fechas")*/}
          <ErrorIcon color="error"/>
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
    <DialogActions>
      <Button onClick={() => {setOpen(false)}} variant="contained" color="primary">
          Cerrar
      </Button>
    </DialogActions>
          
  </Dialog>

  </>
);
}