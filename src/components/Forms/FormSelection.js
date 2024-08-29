import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { useSelector } from 'react-redux';

const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#f5f5f5',
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  width: '80%',
  padding: theme.spacing(1.5),
  fontSize: '1rem',
  '&.MuiButton-containedPrimary': { backgroundColor: '#0072C6' },
  '&.MuiButton-containedSecondary': { backgroundColor: '#A6A6A6' },
  '&:hover.MuiButton-containedPrimary': { backgroundColor: '#005B9A' },
  '&:hover.MuiButton-containedSecondary': { backgroundColor: '#7A7A7A' },
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: '#0072C6',
  textAlign: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
  textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
}));

const FormSelection = () => {
  const { cuatrimestre } = useParams(); // Captura del cuatrimestre
  const navigate = useNavigate(); // Hook para navegación
  const user = useSelector((state) => state.user); // Obtener el usuario desde Redux

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Container maxWidth="sm">
      <Root>
        {user.role !== 'admin' ? (
          <Title variant="h4">Bienvenido, {user.name}!</Title>
        ) : null}
        <Typography variant="h5" style={{ color: '#555' }}>
          {cuatrimestre || '2C2024'}
        </Typography>
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
        </Box>
      </Root>
    </Container>
  );
};

export default FormSelection;