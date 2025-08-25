import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/system";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import BackgroundContainer from "../components/UI/BackgroundContainer.js";
import MySnackbar from "../components/UI/MySnackBar.js";
import { resetPasswordWithToken } from "../api/auth.js";

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

const ResetPasswordView = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  useEffect(() => {
    // Extraer token de los query params
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get('token');
    
    if (!tokenParam) {
      setNotification({
        open: true,
        message: "Token inválido o faltante. Por favor, solicita un nuevo link de recuperación.",
        status: "error",
      });
      // Redirigir a forgot password después de un delay
      setTimeout(() => {
        navigate("/forgot-password");
      }, 3000);
    } else {
      setToken(tokenParam);
    }
  }, [location.search, navigate]);

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validaciones
    if (password.length < 6) {
      setNotification({
        open: true,
        message: "La contraseña debe tener al menos 6 caracteres",
        status: "error",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setNotification({
        open: true,
        message: "Las contraseñas no coinciden",
        status: "error",
      });
      setLoading(false);
      return;
    }

    if (!token) {
      setNotification({
        open: true,
        message: "Token inválido. Por favor, solicita un nuevo link de recuperación.",
        status: "error",
      });
      setLoading(false);
      return;
    }

    try {
      await resetPasswordWithToken(password, token);
      
      setNotification({
        open: true,
        message: "¡Contraseña restablecida exitosamente! Redirigiendo al login...",
        status: "success",
      });
      
      // Navegar al login después de un delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
      
    } catch (error) {
      console.error("Error al restablecer contraseña", error);
      setNotification({
        open: true,
        message: error.message || "Error al restablecer la contraseña. El token puede haber expirado.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <BackgroundContainer />
      <Root>
        <Box textAlign="center">
          <Title variant="h4">Restablecer Contraseña</Title>
          <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 3 }}>
            Ingresa tu nueva contraseña
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nueva Contraseña"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            label="Confirmar Nueva Contraseña"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <ButtonStyled
            disabled={loading || !token}
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
          >
            {loading ? "Restableciendo..." : "Restablecer Contraseña"}
          </ButtonStyled>
        </form>

        <Box textAlign="center" sx={{ marginTop: 3 }}>
          <Link
            to="/forgot-password"
            style={{
              color: '#1976d2',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            ¿Necesitas un nuevo link de recuperación?
          </Link>
        </Box>

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

export default ResetPasswordView; 
