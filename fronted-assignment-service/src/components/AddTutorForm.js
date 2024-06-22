import React, { useState } from 'react';
import { Typography, TextField, Button, Paper } from '@mui/material';
import { styled } from '@mui/system';

const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
  marginBottom: theme.spacing(5),
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
}));

const AddTutorForm = () => {
  const [corrector, setCorrector] = useState({
    name: '',
    lastName: '',
    email: '',
  });

  const handleCorrectorChange = (e) => {
    setCorrector({ ...corrector, [e.target.name]: e.target.value });
  };

  const handleAddCorrectorSubmit = (e) => {
    e.preventDefault();
    console.log('Nuevo Corrector:', corrector);
    alert('Nuevo corrector agregado con éxito');
    setCorrector({ name: '', lastName: '', email: '' });
  };

  return (
    <Root>
      <Title variant="h5">Agregar Corrector</Title>
      <form onSubmit={handleAddCorrectorSubmit}>
        <TextField
          label="Nombre"
          name="name"
          value={corrector.name}
          onChange={handleCorrectorChange}
          fullWidth
          margin="normal"
          variant="outlined"
          required
        />
        <TextField
          label="Apellido"
          name="lastName"
          value={corrector.lastName}
          onChange={handleCorrectorChange}
          fullWidth
          margin="normal"
          variant="outlined"
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={corrector.email}
          onChange={handleCorrectorChange}
          fullWidth
          margin="normal"
          variant="outlined"
          required
        />
        <ButtonStyled variant="contained" color="primary" type="submit">
          Agregar Corrector
        </ButtonStyled>
      </form>
    </Root>
  );
};

export default AddTutorForm;