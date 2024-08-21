import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import fiubaLogo from '../../assets/Logo-fiuba_big_face.png'; 
import { useDispatch } from 'react-redux';
import { clearUser } from '../../redux/userSlice';

const Header = ({ user, color, handleHomeClick }) => {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleLogoClick = () => {
        handleHomeClick();  // Llamar la función para restablecer el estado
        if(user.role === 'admin'){
          navigate('/admin');  
        }
        else{
          navigate('/form-selection');
        }
    };

    const handleLogout = () => {
      dispatch(clearUser());
      navigate('/');
    }

  return (
    <AppBar position="static" style={{ backgroundColor: color }}>
      <Container maxWidth="lg">
        <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <img src={fiubaLogo} alt="FIUBA Logo" style={{ height: '40px', marginRight: '15px' }} />
            <Typography variant="h6">
              FIUBA
            </Typography>
          </Box>
          {user && (
            <Box>
              <Button color="inherit" onClick={() => navigate('/profile')}>
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