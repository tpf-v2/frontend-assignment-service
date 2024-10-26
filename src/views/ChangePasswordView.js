import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { styled } from '@mui/system';
import BackgroundContainer from '../components/UI/BackgroundContainer.js';
import MySnackbar from '../components/UI/MySnackBar.js';
import { resetPassword } from '../api/postChangePassword.js';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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

const ChangePasswordView = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword.length > 8 && newPassword === repeatNewPassword) {
      
      try{
        await resetPassword(user, newPassword, currentPassword)
        setNotification({
          open: true,
          message: "Contraseña cambiada exitosamente",
          status: "success",
        });
      }
      catch(e){
        setNotification({
          open: true,
          message: "La contraseña no pudo cambiarse correctamente. Intentelo nuevamente más tarde",
          status: "error",
        });
      }
    } else {
      setNotification({
        open: true,
        message: newPassword.length <= 8 ? "La nueva contraseña debe tener más de 8 caracteres." : "Las contraseñas no coinciden.",
        status: "error",
      });
    }

    setTimeout(() => {
      navigate(`/home`); 
    }, 1000); 

    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <BackgroundContainer />
      <Root>
        <Box textAlign="center">
          <Title variant="h4">Cambiar Contraseña</Title>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Contraseña Actual"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <TextField
            label="Nueva Contraseña"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <TextField
            label="Repetir Nueva Contraseña"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={repeatNewPassword}
            onChange={(e) => setRepeatNewPassword(e.target.value)}
            required
          />
          <ButtonStyled disabled={loading} variant="contained" color="primary" type="submit" fullWidth>
            {loading ? "Cargando ..." : "Cambiar Contraseña"}
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

export default ChangePasswordView;