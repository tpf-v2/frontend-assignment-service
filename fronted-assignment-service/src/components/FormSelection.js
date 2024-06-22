import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box, Paper } from '@mui/material';
import { styled } from '@mui/system';

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
              <ButtonStyled variant="contained" color="primary" onClick={() => handleNavigation('/tutor-form')}>
                Enviar Formulario de Temas a Tutorear
              </ButtonStyled>
              <ButtonStyled variant="contained" color="secondary" onClick={() => handleNavigation('/admin-form')}>
                Asignar Tutor
              </ButtonStyled>
            </>
          )}
        </Box>
      </Root>
    </Container>
  );
};

export default FormSelection;