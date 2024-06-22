import React from 'react';
import { Typography, Box, Button, Container, Paper } from '@mui/material';
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
}));

const StudentForm = () => {
  return (
    <Container maxWidth="sm">
      <Root>
        <Title variant="h5">Enviar Formulario de Grupo</Title>
        {/* Aquí podrías agregar el formulario real */}
        <ButtonStyled variant="contained" color="primary">
          Enviar Formulario de Grupo
        </ButtonStyled>
      </Root>
    </Container>
  );
};

export default StudentForm;