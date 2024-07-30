import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import BackgroundContainer from './UI/BackgroundContainer';
import { postLogin } from '../api/postLogin';
import axios from 'axios'

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
  'jperez1@fi.uba.ar': { name: 'Juan', role: 'student', lastName: 'Perez', password: 'password' },
  'tutor@example.com': { name: 'María', role: 'tutor', lastName: 'Gomez', password: 'password' },
  'admin@example.com': { name: 'Admin', role: 'admin', lastName: 'Smith', password: 'password' },
};

const Home = ({ logInUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userData = hardcodedUsers[email];
  
    if (email && password) {
      try {
        const response = await fetch('http://127.0.0.1:8000/connect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            username: email,
            password: password,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log("Token:", data);
          
          logInUser(userData); // También puedes llamar a logInUser aquí
          navigate('/form-selection', { state: { user: userData } });
        } else {
          const errorData = await response.json();
          alert(errorData.detail || 'Error al iniciar sesión');
        }
      } catch (error) {
        console.error("Error al intentar loguear el usuario", error);
        alert('Error al intentar iniciar sesión');
      }
    } else {
      alert('Usuario no encontrado o contraseña incorrecta');
    }
  };

  return (
    <Container maxWidth="sm">
      <BackgroundContainer />
      <Root>
        <Box textAlign="center">
          <Title variant="h4">Iniciar Sesión</Title>
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
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <ButtonStyled variant="contained" color="primary" type="submit" fullWidth>
            Iniciar Sesión
          </ButtonStyled>
        </form>
      </Root>
    </Container>
  );
};

export default Home;