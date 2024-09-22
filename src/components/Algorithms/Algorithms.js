import React, { useState } from "react";
import { Container, Box, Paper, Typography, Button, DialogTitle, DialogContent, CircularProgress, Dialog, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { styled, useMediaQuery, useTheme } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import GroupDataTable from "./GroupDataTable";
import { useNavigate, useParams } from "react-router-dom";
import { getTableData } from "../../api/handleTableData";
import { useSelector } from "react-redux";

// Componente para cada bloque de pasos
const StepBlock = ({ title, onRun, isRunDisabled, isEditableDisabled, isDownloadDisabled }) => (
  <Box
    sx={{
      textAlign: "center",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      minWidth: "200px",
    }}
  >
    <h3>{title}</h3>
    <ButtonStyled
      variant="contained"
      sx={{ bgcolor: "#007bff", color: "#fff", mb: 1 }}
      onClick={onRun}
      disabled={isRunDisabled} // Deshabilitado si es necesario
    >
      Correr
    </ButtonStyled>
    {/* <br />
    <ButtonStyled
      variant="contained"
      sx={{ bgcolor: "#007bff", color: "#fff", mb: 1 }}
      disabled={isEditableDisabled} // Deshabilitado si es necesario
    >
      Editar resultado
    </ButtonStyled>
    <br />
    <ButtonStyled
      variant="contained"
      sx={{ bgcolor: "#007bff", color: "#fff" }}
      disabled={isDownloadDisabled} // Deshabilitado si es necesario
    >
      Descargar
    </ButtonStyled> */}
  </Box>
);

// Estilos
const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#ffffff",
  boxShadow: theme.shadows[3],
}));

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
  minWidth: "200px",
  "&:hover": {
    backgroundColor: "#005B9A",
  },
}));

const Algorithms = () => {
  // Estados para controlar los botones
  const [isRunDisabledStep1, setRunDisabledStep1] = useState(false); // El primer botón de "Correr" está habilitado al principio
  const [isRunDisabledStep2, setRunDisabledStep2] = useState(false); // "Correr" del paso 2 deshabilitado al principio 
  const [isRunDisabledStep3, setRunDisabledStep3] = useState(true); // "Correr" del paso 3 deshabilitado al principio
  const [isEditableDisabledStep2, setEditableDisabledStep2] = useState(true);
  const [isDownloadDisabledStep2, setDownloadDisabledStep2] = useState(true);
  const [isEditableDisabledStep3, setEditableDisabledStep3] = useState(true);
  const [isDownloadDisabledStep3, setDownloadDisabledStep3] = useState(true);

  const navigate = useNavigate();
  const { cuatrimestre } = useParams();

  const [loading, setLoading] = useState(false); // Estado de carga
  const [openDialog, setOpenDialog] = useState(false); // Control del diálogo
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md')); // Para pantallas pequeñas

  // Función para manejar el paso 1
  const handleRunStep1 = () => {
    setLoading(true); // Mostrar "Cargando"
    setOpenDialog(true); // Abrir el pop-up

    // TODO: Correr algoritmo

    // Simula un tiempo de espera para la carga de los datos (aca correr el algoritmo)
    setTimeout(() => {
      setLoading(false); // Oculta el "Cargando"
      navigate(`/dashboard/${cuatrimestre}/groups`)

    }, 2000); // Simulación de 2 segundos para la carga

    setRunDisabledStep2(false);       // Habilitar botón "Correr" del paso 2
    setRunDisabledStep1(true);        // Deshabilitar botón "Correr" del paso 1
  };

  // Función para manejar el paso 2
  const handleRunStep2 = () => {
    setEditableDisabledStep2(false);  // Habilitar botón "Editar" del paso 2
    setDownloadDisabledStep2(false);  // Habilitar botón "Descargar" del paso 2
    setRunDisabledStep3(false);       // Habilitar botón "Correr" del paso 3
    setRunDisabledStep2(true);        // Deshabilitar botón "Correr" del paso 2

  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Función para manejar el paso 3
  const handleRunStep3 = () => {
    setEditableDisabledStep3(false);  // Habilitar botón "Editar" del paso 3
    setDownloadDisabledStep3(false);  // Habilitar botón "Descargar" del paso 3
    setRunDisabledStep3(true);        // Deshabilitar botón "Correr" del paso 3

    // Deshabilitar los botones "Editar" y "Descargar" del paso 2
    setEditableDisabledStep2(true);
    setDownloadDisabledStep2(true);
  };

  return (
    <Container maxWidth="lg" >
      <Root>
        <Title variant="h4">Algoritmos de asignación</Title>

        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 5,
          }}
        >
          {/* Paso 1 */}
          <StepBlock
            title="Armar grupos"
            onRun={handleRunStep1} // Ejecutar y habilitar siguiente paso
            isRunDisabled={isRunDisabledStep1} // El primer botón de "Correr" está habilitado
          />
          <ArrowForwardIcon sx={{ fontSize: 50, mx: 2 }} />
          {/* Paso 2 */}
          <StepBlock
            title="Asignar tema y tutor a cada grupo"
            onRun={handleRunStep2} // Ejecutar y habilitar siguiente paso
            isRunDisabled={isRunDisabledStep2} // Botón de "Correr" deshabilitado al principio
            isEditableDisabled={isEditableDisabledStep2}
            isDownloadDisabled={isDownloadDisabledStep2}
          />
          <ArrowForwardIcon sx={{ fontSize: 50, mx: 2 }} />
          {/* Paso 3 */}
          <StepBlock
            title="Asignar fecha de presentación"
            onRun={handleRunStep3} // Ejecutar
            isRunDisabled={isRunDisabledStep3} // Botón de "Correr" deshabilitado al principio
            isEditableDisabled={isEditableDisabledStep3}
            isDownloadDisabled={isDownloadDisabledStep3}
          />
        </Container>
      </Root>
      {/* Pop-up para mostrar la carga y los grupos */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullScreen={fullScreen} // El diálogo será pantalla completa en pantallas pequeñas
        maxWidth="lg" // Ancho máximo del diálogo
        fullWidth // Hace que el diálogo ocupe todo el ancho disponible
        sx={{
          height: '100%', // Que ocupe todo el alto de la pantalla
          maxHeight: '100vh', // Altura máxima
        }}
      >
        <DialogTitle>
          {!loading && "Grupos Formados"}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
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
            height: '100%', // Hace que el contenido ocupe todo el alto
            minHeight: '300px', // Añadir altura mínima para evitar que se achique
            maxHeight: '100vh', // Asegura que el contenido no se desborde
            minWidth: '300px', // Añadir ancho mínimo
          }}
        >
          {loading && 
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Armando grupos...</Typography>
            </Box>
          }
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Algorithms;
