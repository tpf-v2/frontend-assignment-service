import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import fiubaLogo from "../../assets/Logo-fiuba_big_face.png";
import { useDispatch } from "react-redux";
import { clearUser } from "../../redux/slices/userSlice";
import { clearTopics } from "../../redux/slices/topicsSlice";
import { clearTutors } from "../../redux/slices/tutorsSlice";
import { clearGroups } from "../../redux/slices/groupsSlice";
import { clearPeriod } from "../../redux/slices/periodSlice";
import { setTemporalRole } from "../../redux/slices/userSlice";

const Header = ({ user, color, handleHomeClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogoClick = () => {
    handleHomeClick();
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

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleChangeRole = (newRole) => {
    dispatch(setTemporalRole(newRole));
  };

  const handleChangeView = () => {
    const newRole = user.temporal_role === "admin" ? "tutor" : "admin";
    handleChangeRole(newRole);
    navigate("/home");
    handleCloseMenu();
  };

  // Extraer la inicial del nombre del usuario
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

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
              <IconButton
                color="inherit"
                onClick={handleProfileClick}
                aria-controls="profile-menu"
                aria-haspopup="true"
              >
                <Avatar style={{ backgroundColor: "#ff5733" }}>
                  {getInitial(user.name)}
                </Avatar>
              </IconButton>
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleCloseMenu();
                  }}
                >
                  Ver Perfil
                </MenuItem>
                {user.role === "admin" && (
                  <MenuItem onClick={handleChangeView}>
                    Cambiar a vista de {user.temporal_role === "admin" ? "tutor" : "admin"}
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    navigate("/change-password");
                    handleCloseMenu();
                  }}
                >
                  Cambiar contraseña
                </MenuItem>
                <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;