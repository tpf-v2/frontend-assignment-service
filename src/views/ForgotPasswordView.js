import { useState } from "react";
import {
  Container,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import BackgroundContainer from "../components/UI/BackgroundContainer.js";
import MySnackbar from "../components/UI/MySnackBar.js";
import { requestPasswordReset } from "../api/auth.js";
import { TitleSimple } from "../styles/Titles.js";
import { Root, ButtonSimple } from "../components/Root.js";

const ButtonStyled = ButtonSimple;

const Title = TitleSimple;

const ForgotPasswordView = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
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

    if (email) {
      try {
        await requestPasswordReset(email);
        
        setNotification({
          open: true,
          message: "Se ha enviado un email con las instrucciones para recuperar tu contraseña",
          status: "success",
        });
        
        // Navegar a página de confirmación después de un delay
        setTimeout(() => {
          navigate("/confirm-email");
        }, 2000);
        
      } catch (error) {
        console.error("Error al solicitar recuperación de contraseña", error);
        setNotification({
          open: true,
          message: error.message || "Error al enviar el email. Verifica que el email sea correcto.",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <BackgroundContainer />
      <Root>
        <Box textAlign="center">
          <Title variant="h4">Recuperar Contraseña</Title>
          <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 3 }}>
            Ingresa tu email y te enviaremos un link para restablecer tu contraseña
          </Typography>
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
          <ButtonStyled
            disabled={loading}
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
          >
            {loading ? "Enviando..." : "Enviar Email de Recuperación"}
          </ButtonStyled>
        </form>

        <Box textAlign="center" sx={{ marginTop: 3 }}>
          <Link
            to="/"
            style={{
              color: '#1976d2',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            ← Volver al login
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

export default ForgotPasswordView;
