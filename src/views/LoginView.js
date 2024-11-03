import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import BackgroundContainer from '../components/UI/BackgroundContainer.js';
import { authenticateUser } from '../api/auth.js'; // Importa las funciones desde auth.js
import { useDispatch, useSelector } from "react-redux";
import MySnackbar from '../components/UI/MySnackBar.js';

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

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user?.token) {
      navigate("/home");
    }
  }, [user])

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  const handleSubmit = async (e) => {
    setloading(true)
    e.preventDefault();

    if (email && password) {
      try {
        await dispatch(authenticateUser(email, password));
        navigate('/home')
      } catch (error) {
        console.error("Error when logging in", error);
        setNotification({
          open: true,
          message: "Nombre de usuario o contraseña incorrectos",
          status: "error",
        });
      } finally {
        setloading(false)
      }
    } else {
      // navigate('/form-selection');
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
          <ButtonStyled disabled={loading} variant="contained" color="primary" type="submit" fullWidth>
            {loading ? "Cargando ..." : "Iniciar Sesión"}
          </ButtonStyled>
        </form>
        <MySnackbar
        open={notification.open}
        handleClose={handleSnackbarClose}
        message={notification.message}
        status={notification.status}
      />
      </Root>
    </Container>
  );
};

export default LoginView;
