import React, {useState} from "react";
import { Grid, Typography, Link, Box, CircularProgress,
         Dialog, Button, DialogTitle, DialogContent,
         Accordion, AccordionSummary, AccordionDetails, } from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AlgorithmPreCheck = ({
  initialDescription, inputInfo, setSelectedMenu,
  msg, showWhoComponent, showWhoList, condition, checkResultIcon, expandableData,
  falseConditionMsg
}) => {  

  const [open, setOpen] = useState(false);
  const [data, setData] = useState();

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
        {/* Muestro lista de cada msj (ej "Existen _n_ ... que no ...", o msj de Todo ok) con su ícono*/}
          {expandableData?.map((okMsgOrProblematicEntity) => (
            <>
            <Grid item xs={12} md={12} sx={{ display: "flex", gap: 0.5}}>  
              {checkResultIcon}
              <Typography variant="body1" sx={{ textAlign: "justify" }}>
                <strong>{okMsgOrProblematicEntity.title}</strong>
              </Typography>
            </Grid>
          {/* Si hay gente que falte al input, y aplique mostrar, muestro botón para ver quiénes son en modal */}
          {okMsgOrProblematicEntity.infoList.length > 0 && condition && (
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
          ))}
          </>
      ) : (
        <Grid item xs={12} md={12} sx={{ display: "flex", gap: 0.5 }}>
          {/* Si esto es false, no aplica mostrarlos xq existe otro problema ("primero admin cargar fechas")*/}
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