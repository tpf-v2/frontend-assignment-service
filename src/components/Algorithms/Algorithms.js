import React, { useState } from "react";
import { Container, Box, Typography, Button, DialogTitle, DialogContent, CircularProgress, Dialog, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { styled, useMediaQuery, useTheme } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate, useParams } from "react-router-dom";

const StepBlock = ({ title, onRun, isRunDisabled }) => (
  <Box
    sx={{
      textAlign: "center",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      width: "100%", // Se ajusta al 100% del ancho disponible
      maxWidth: "250px", // Tamaño máximo en pantallas grandes
      margin: "10px",
    }}
  >
    <h3>{title}</h3>
    <ButtonStyled
      variant="contained"
      sx={{ bgcolor: "#007bff", color: "#fff", mb: 1 }}
      onClick={onRun}
      disabled={isRunDisabled}
    >
      Correr
    </ButtonStyled>
  </Box>
);

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: "#0072C6",
  textAlign: "center",
  fontSize: "2rem",
  fontWeight: "bold",
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  backgroundColor: "#0072C6",
  color: "#ffffff",
  transition: "background-color 0.3s",
  minWidth: "150px",
  "&:hover": {
    backgroundColor: "#005B9A",
  },
}));

const Algorithms = () => {
  const navigate = useNavigate();
  const { period } = useParams();

  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleRunStep1 = () => {
    setLoading(true);
    setOpenDialog(true);

    setTimeout(() => {
      setLoading(false);
      navigate(`/dashboard/${period}/groups`);
    }, 2000);
  };

  const handleRunStep2 = () => {
    // Aquí podrías agregar la lógica para manejar el segundo paso
  };

  const handleRunStep3 = () => {
    // Aquí podrías agregar la lógica para manejar el tercer paso
  };

  return (
    <Container maxWidth={false} sx={{ overflow: "hidden" }}> 
        <Title variant="h4">Algoritmos de asignación</Title>

        <Container
          maxWidth={false}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "center",
            mt: 5,
            // overflowX: "auto", // Permite que el contenido se desplace en pantallas pequeñas
          }}
        >
          <StepBlock
            title="Armar grupos"
            onRun={handleRunStep1}
            isRunDisabled={period.groups_assignment_completed} // Deshabilitar si ya se completó
          />
          <ArrowForwardIcon sx={{ fontSize: { xs: 30, md: 50 }, mx: 2 }} />
          <StepBlock
            title="Asignar tema y tutor a cada grupo"
            onRun={handleRunStep2}
            isRunDisabled={period.topics_tutors_assignment_completed} // Deshabilitar si ya se completó
          />
          <ArrowForwardIcon sx={{ fontSize: { xs: 30, md: 50 }, mx: 2 }} />
          <StepBlock
            title="Asignar fecha de presentación"
            onRun={handleRunStep3}
            isRunDisabled={period.presentation_dates_assignment_completed} // Deshabilitar si ya se completó
          />
        </Container>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullScreen={fullScreen}
        maxWidth="lg"
        fullWidth
        sx={{
          height: '100%',
          maxHeight: '100vh',
        }}
      >
        <DialogTitle>
          {!loading && "Grupos Formados"}
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            minHeight: '300px',
            maxHeight: '100vh',
            minWidth: '300px',
          }}
        >
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Armando grupos...</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Algorithms;

// import React, { useState } from 'react';
// import { Stepper, Step, StepLabel, Button, Box, Typography } from '@mui/material';

// const steps = ['Armar grupos', 'Asignar tema y tutor a cada grupo', 'Asignar fecha de presentación'];

// const Algorithms = () => {
//   const [activeStep, setActiveStep] = useState(0);

//   const handleNext = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   return (
//     <Box sx={{ width: '100%' }}>
//       <Stepper activeStep={activeStep} alternativeLabel>
//         {steps.map((label) => (
//           <Step key={label}>
//             <StepLabel>{label}</StepLabel>
//           </Step>
//         ))}
//       </Stepper>
//       <Box sx={{ mt: 2, mb: 2 }}>
//         {activeStep === steps.length ? (
//           <Typography variant="h6" sx={{ textAlign: 'center' }}>
//             ¡Todos los pasos completados!
//           </Typography>
//         ) : (
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//             <Typography variant="h6">{steps[activeStep]}</Typography>
//             <Button 
//               variant="contained" 
//               onClick={handleNext} 
//               sx={{ mt: 2 }}
//               disabled={activeStep === steps.length - 1}
//             >
//               {activeStep === steps.length - 1 ? 'Finalizar' : 'Correr'}
//             </Button>
//           </Box>
//         )}
//       </Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//         <Button disabled={activeStep === 0} onClick={handleBack}>
//           Atrás
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default Algorithms;

