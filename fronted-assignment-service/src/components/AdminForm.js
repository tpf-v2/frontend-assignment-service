import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Container, Paper } from '@mui/material';
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

const AdminForm = () => {
  const [tutorEmail, setTutorEmail] = useState('');

  const handleAssignTutor = () => {
    alert(`El email ${tutorEmail} ha sido asignado como tutor`);
  };

  return (
    <Container maxWidth="sm">
      <Root>
        <Title variant="h5">Asignar Tutor</Title>
        <TextField
          label="Email del tutor"
          fullWidth
          margin="normal"
          variant="outlined"
          value={tutorEmail}
          onChange={(e) => setTutorEmail(e.target.value)}
          required
        />
        <ButtonStyled variant="contained" color="primary" onClick={handleAssignTutor}>
          Asignar Tutor
        </ButtonStyled>
      </Root>
    </Container>
  );
};

export default AdminForm;