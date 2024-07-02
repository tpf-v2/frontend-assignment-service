import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header = ({ user }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            FIUBA App
          </Typography>
          {user && (
            <Button color="inherit" onClick={() => navigate('/profile')}>
              Ver Perfil
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;