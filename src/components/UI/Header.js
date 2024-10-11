import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import fiubaLogo from "../../assets/Logo-fiuba_big_face.png";
import { useDispatch } from "react-redux";
import { clearUser } from "../../redux/slices/userSlice";
import { clearTopics } from "../../redux/slices/topicsSlice";
import { clearTutors } from "../../redux/slices/tutorsSlice";
import { clearGroups } from "../../redux/slices/groupsSlice";
import { clearPeriod } from "../../redux/slices/periodSlice";

const Header = ({ user, color, handleHomeClick }) => {
  const dispatch = useDispatch();
  const location = useLocation(); // Obtener la ruta actual
  const navigate = useNavigate();

  const handleLogoClick = () => {
    handleHomeClick(); // Llamar la función para restablecer el estado
    navigate("/home");
  };

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(clearTopics());
    dispatch(clearTutors());
    dispatch(clearGroups());
    dispatch(clearPeriod());
    navigate("/");
  };

  // Expresión regular que busca el patrón numeroCnumeronumeronumeronumero (ej. 3C1234)
  const regex = /\dC\d{4}/;

  // Extraer el cuatrimestre del pathname
  const cuatrimestreMatch = location.pathname.match(regex);
  const cuatrimestre = cuatrimestreMatch ? cuatrimestreMatch[0] : null;

  // Condición para mostrar el botón solo si el cuatrimestre fue encontrado y el usuario es admin
  const showButton = cuatrimestre && user.role === "admin";

  return (
    <AppBar position="static" style={{ backgroundColor: color }}>
      <Container maxWidth="lg">
        <Toolbar>
          <Box display="flex" alignItems="center" flexGrow={1}>
            <Box
              display="flex"
              alignItems="center"
              onClick={handleLogoClick}
              style={{ cursor: "pointer" }}
            >
              <img
                src={fiubaLogo}
                alt="FIUBA Logo"
                style={{ height: "40px", marginRight: "15px" }}
              />
              <Typography variant="h6">FIUBA</Typography>
            </Box>
          </Box>
          {user && (
            <Box>
              {showButton && (
                <Button
                  color="inherit"
                  onClick={() => navigate(`/dashboard/${cuatrimestre}`)}
                >
                  INICIO
                </Button>
              )}
              <Button color="inherit" onClick={() => navigate("/profile")}>
                Ver Perfil
              </Button>
              <Button color="inherit" onClick={() => handleLogout()}>
                Cerrar sesión
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
