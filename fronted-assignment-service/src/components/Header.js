import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import fiubaLogo from '../assets/Logo-fiuba_big_face.png'; // Asegúrate de que el path al logo es correcto
const Header = ({ user }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Box display="flex" alignItems="center" flexGrow={1}>
            <img src={fiubaLogo} alt="FIUBA Logo" style={{ height: '40px', marginRight: '15px' }} />
            <Typography variant="h6">
              FIUBA
            </Typography>
          </Box>
          {user && (
            <Box>
              <Button color="inherit" onClick={() => navigate('/')}>
                Home
              </Button>
              <Button color="inherit" onClick={() => navigate('/profile')}>
                Ver Perfil
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;