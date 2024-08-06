import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import fiubaLogo from '../../assets/Logo-fiuba_big_face.png'; 
import { useDispatch } from 'react-redux';
import { clearUser } from '../../redux/userSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Header = ({ user, color, handleHomeClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogoClick = () => {
        handleHomeClick(); // Llamar la función para restablecer el estado
        navigate('/form-selection'); // Navegar a la página principal de selección
    };

    const handleLogout = () => {
        dispatch(clearUser());
        navigate('/');
    };

    const handleBackClick = () => {
        const referrer = document.referrer; // Obtener el referrer
        const homeUrl = window.location.origin; // Obtener la URL base (simula la home)

        console.log(referrer)

        // Verificar si la referrer es igual a la URL de la Home
        if (referrer === homeUrl || referrer.endsWith('/')) {
            return; // No permitir navegar hacia atrás
        }
        navigate(-1); // Navegar hacia la página anterior
    };

    return (
        <AppBar position="static" style={{ backgroundColor: color }}>
            <Container maxWidth="lg">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleBackClick} aria-label="back">
                        <ArrowBackIcon />
                    </IconButton>
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
                            <Button color="inherit" onClick={handleLogout}>
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