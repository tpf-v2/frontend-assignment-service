import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box, Paper } from '@mui/material';
import { styled } from '@mui/system';

const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
  textAlign: 'center', // Centrar el texto en el papel
  borderRadius: theme.shape.borderRadius, // Bordes redondeados
  backgroundColor: '#f5f5f5', // Color de fondo más claro
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  width: '80%', // Ensanchar los botones
  padding: theme.spacing(1.5), // Aumentar el padding para botones más grandes
  fontSize: '1rem', // Aumentar el tamaño de la fuente
  '&.MuiButton-containedPrimary': { backgroundColor: '#0072C6' }, // Color celeste FIUBA
  '&.MuiButton-containedSecondary': { backgroundColor: '#A6A6A6' }, // Color gris claro para botones secundarios
  '&:hover.MuiButton-containedPrimary': { backgroundColor: '#005B9A' }, // Color hover para botones primarios
  '&:hover.MuiButton-containedSecondary': { backgroundColor: '#7A7A7A' }, // Color hover para botones secundarios
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: '#0072C6', // Color celeste FIUBA
  textAlign: 'center',
}));

const FormSelection = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = state;

  const handleNavigation = (path) => {
    navigate(path, { state: { user } });
  };

  return (
    <Container maxWidth="sm">
      <Root>
        <Title variant="h4">Bienvenido, {user.name}!</Title>
        <Box textAlign="center">
          {user.role === 'student' && (
            <ButtonStyled variant="contained" color="primary" onClick={() => handleNavigation('/student-form')}>
              Enviar Formulario de Grupo
            </ButtonStyled>
          )}
          {user.role === 'tutor' && (
            <ButtonStyled variant="contained" color="primary" onClick={() => handleNavigation('/tutor-form')}>
              Enviar Formulario de Temas a Tutorear
            </ButtonStyled>
          )}
          {user.role === 'admin' && (
            <>
              <ButtonStyled variant="contained" color="primary" onClick={() => handleNavigation('/upload-students')}>
                Cargar Archivo de Alumnos
              </ButtonStyled>
              <ButtonStyled variant="contained" color="primary" onClick={() => handleNavigation('/upload-topics')}>
                Cargar Archivo de Temas
              </ButtonStyled>
              <ButtonStyled variant="contained" color="primary" onClick={() => handleNavigation('/upload-tutors')}>
                Cargar Archivo de Tutores
              </ButtonStyled>
            </>
          )}
        </Box>
      </Root>
    </Container>
  );
};

export default FormSelection;