import React, {useState} from "react";
import { Grid, Typography, Link, Box, CircularProgress,
         Dialog, Button, DialogTitle, DialogContent,
         Accordion, AccordionSummary, AccordionDetails, } from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AlgorithmPreCheck = ({
  initialDescription, inputInfo, algorithm, setSelectedMenu,
  msg, showWhoComponent, showWhoList, condition, checkResultIcon, expandableData,
  falseConditionMsg
}) => {  

  const [open, setOpen] = useState(false);
  const [data, setData] = useState();

  // // Aux tutores mientras pruebo
  let showWhoComponentTutors;
  let showWhoListTutors;
  let msgTutors;

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