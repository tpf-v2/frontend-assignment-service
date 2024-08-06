import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import BackgroundContainer from './UI/BackgroundContainer';
import { authenticateUser } from '../api/auth.js'; // Importa las funciones desde auth.js
import { useDispatch } from "react-redux";

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

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email && password) {
      try {
        const data = await dispatch(authenticateUser(email, password));
        if(data.role === 'admin'){
          navigate('/admin')
        }
        else{
          navigate('/form-selection');
        }
      } catch (error) {
        console.error("Error al intentar loguear el usuario", error);
        alert(error.message || 'Error al intentar iniciar sesión');
      }
    } else {
      navigate('/form-selection');
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
