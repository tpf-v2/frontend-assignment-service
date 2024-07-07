import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

const hardcodedUsers = {
  'student@example.com': { name: 'Juan', role: 'student', lastName: 'Perez' },
  'tutor@example.com': { name: 'María', role: 'tutor', lastName: 'Gomez' },
  'admin@example.com': { name: 'Admin', role: 'admin', lastName: 'Smith' },
};

const Home = ({ logInUser }) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = hardcodedUsers[email];
    if (userData) {
      logInUser(userData);
      navigate('/form-selection', { state: { user: userData } });
    } else {
      alert('Usuario no encontrado');
    }
  };

  return (
    <Container maxWidth="sm">
      <Root>
        <Box textAlign="center">
          <Title variant="h4">Ingrese su Email</Title>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <ButtonStyled variant="contained" color="primary" type="submit" fullWidth>
            Submit
          </ButtonStyled>
        </form>
      </Root>
    </Container>
  );
};

export default Home;