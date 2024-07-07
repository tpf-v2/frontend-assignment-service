import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Container, TextField, Button, Typography, Box, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

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

const cuatrimestres = ['2C2024', '1C2025', '2C2025'];

const UploadWhitelistForm = () => {
  const [cuatrimestre, setCuatrimestre] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');

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
    accept: '.csv'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileError('Por favor cargue un archivo CSV.');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('cuatrimestre', cuatrimestre);

    try {
      const response = await axios.post('http://127.0.0.1:8000/upload-whitelist', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        alert('Whitelist cargada con éxito');
      } else {
        alert('Hubo un problema al cargar la whitelist');
      }
    } catch (error) {
      console.error('Error al cargar la whitelist', error);
      alert('Error al cargar la whitelist');
    }
  };

  return (
    <Container maxWidth="sm">
      <Root>
        <Box textAlign="center">
          <Title variant="h5">Cargar Whitelist de Alumnos</Title>
        </Box>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Cuatrimestre</InputLabel>
            <Select
              value={cuatrimestre}
              onChange={(e) => setCuatrimestre(e.target.value)}
              label="Cuatrimestre"
              required
            >
              {cuatrimestres.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            Enviar
          </ButtonStyled>
        </form>
      </Root>
    </Container>
  );
};

export default UploadWhitelistForm;