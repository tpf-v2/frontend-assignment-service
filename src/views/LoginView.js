import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { togglePasswordVisibility } from "./PasswordVisibility.js";
import { Link, useNavigate } from "react-router-dom";
import BackgroundContainer from "../components/UI/BackgroundContainer.js";
import { authenticateUser } from "../api/auth.js"; // Importa las funciones desde auth.js
import { useDispatch, useSelector } from "react-redux";
import MySnackbar from "../components/UI/MySnackBar.js";
import { TitleSimple } from "../styles/Titles.js";
import { Root, ButtonSimple } from "../components/Root.js";

const ButtonStyled = ButtonSimple;
const Title = TitleSimple;

const LoginView = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user?.token) {
      navigate("/home");
    }
  }, [user]);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  const handleSubmit = async (e) => {
    setloading(true);
    e.preventDefault();

    if (email && password) {
      try {
        await dispatch(authenticateUser(email, password));
        navigate("/home");
      } catch (error) {
        console.error("Error when logging in", error);
        setNotification({
          open: true,
          message: "Nombre de usuario o contraseña incorrectos",
          status: "error",
        });
      } finally {
        setloading(false);
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
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            // El adornment es para poner el ícono del 'ojito' Adentro del textfield
            InputProps={togglePasswordVisibility(showPassword, setShowPassword)}
          />
          <ButtonStyled
            disabled={loading}
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
          >
            {loading ? "Cargando ..." : "Iniciar Sesión"}
          </ButtonStyled>
        </form>

        <Box textAlign="center" sx={{ marginTop: 2 }}>
          <Link
            to="/forgot-password"
            style={{
              color: '#1976d2',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </Box>

        <Divider sx={{ marginTop: 3, marginBottom: 2 }} />
        <Typography
          variant="body2"
          align="center"
          color="textSecondary"
          sx={{ marginTop: 2 }}
        >
          Este sitio es un Trabajo Profesional de Ing. Informática.{" "}
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault(); // Evita que se recargue la página
              navigate("/credits");
            }}
            underline="hover"
            color="primary"
          >
            Ver créditos
          </Link>
        </Typography>

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
