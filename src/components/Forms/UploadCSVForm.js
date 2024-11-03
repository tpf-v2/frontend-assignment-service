import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector, useDispatch } from "react-redux";

import {
  Container,
  Button,
  Typography,
  Box,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
}));

const DropzoneBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #cccccc',
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  color: 'rgba(0, 0, 0, 0.6)',
  marginBottom: theme.spacing(2),
}));

const BASE_URL = process.env.REACT_APP_API_URL;

const TITLE_DICT = {
  "students": "Alumnos",
  "tutors": "Tutores",
  "topics": "Temas"
}

const UploadCSVForm = ({ formType, setItems }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // Estado para controlar el diálogo
  const [loading, setLoading] = useState(false); // Estado para controlar el diálogo

  const period = useSelector((state) => state.period);
  const user = useSelector((state) => state.user);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file);
      setFileError('');
    } else {
      setFileError('Por favor cargue un archivo CSV.');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.csv',
  });

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileError('Por favor cargue un archivo CSV.');
      return;
    }
    setLoading(true)
    const formData = new FormData();
    formData.append('file', selectedFile);
    const apiUrl = `${BASE_URL}/${formType}/upload?period=${period.id}`;
    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'text/csv',
          Authorization: `Bearer ${user.token}`
        },
      });
      if (response.status === 201) {
        setResponseMessage(`Archivo de ${formType} cargado con éxito`);
        setIsSuccess(true);
        dispatch(setItems(response));
      } else {
        setResponseMessage(`Hubo un problema al cargar el archivo de ${formType}`);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error(`Error al cargar el archivo de ${formType}`, error);
      setResponseMessage(`Error al cargar el archivo de ${formType}`);
      setIsSuccess(false);
    } finally {
      setOpenDialog(true); // Abre el diálogo al finalizar
      setLoading(false)
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="sm">
      <Root>
        <Box textAlign="center">
          <Title variant="h5">Cargar Archivo de {TITLE_DICT[formType]}</Title>
        </Box>

        <form onSubmit={handleSubmit}>
          <DropzoneBox {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Suelta el archivo aquí...</p>
            ) : (
              <p>Arrastra y suelta el archivo aquí, o haz clic para seleccionar el archivo CSV</p>
            )}
          </DropzoneBox>
          {selectedFile && (
            <Typography variant="body1">
              Archivo seleccionado: {selectedFile.name}
            </Typography>
          )}
          {fileError && (
            <Typography variant="body2" color="error">
              {fileError}
            </Typography>
          )}
          <ButtonStyled variant="contained" color="primary" type="submit" fullWidth>
            {loading ? "Cargando..." : "Enviar"}
          </ButtonStyled>
        </form>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="xs"
          fullWidth
        >
          {/* Icono centrado y mensaje */}
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "24px 16px",
            }}
          >
            {isSuccess ? (
              <CheckCircleIcon sx={{ fontSize: 60, color: "#4CAF50" }} />
            ) : (
              <ErrorIcon sx={{ fontSize: 60, color: "#F44336" }} />
            )}
            <Typography
              variant="h6"
              sx={{
                color: isSuccess ? "#4CAF50" : "#F44336",
                fontWeight: "600",
                marginTop: "16px",
              }}
            >
              {isSuccess ? "¡Operación Exitosa!" : "Ha Ocurrido un Error"}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ marginTop: "8px", padding: "0 12px" }}
            >
              {responseMessage}
            </Typography>
          </DialogContent>

          {/* Botón de acción centrado */}
          <DialogActions
            sx={{ justifyContent: "center", paddingBottom: "16px" }}
          >
            <Button
              onClick={handleCloseDialog}
              variant="contained"
              sx={{
                backgroundColor: isSuccess ? "#4CAF50" : "#F44336",
                color: "white",
                padding: "8px 24px",
                fontWeight: "bold",
                borderRadius: "24px",
                "&:hover": {
                  backgroundColor: isSuccess ? "#388E3C" : "#D32F2F",
                },
              }}
            >
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </Root>
    </Container>
  );
};

export default UploadCSVForm;