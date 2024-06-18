import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import fiubaLogo from '../assets/fiuba-logo.png';

const RoleSelection = () => {
    const navigate = useNavigate();
    return (
        <Container style={{ textAlign: 'center', marginTop: '50px' }}>
            <img 
                src={fiubaLogo} 
                alt="FIUBA Logo" 
                style={{ width: '400px', marginBottom: '30px' }} 
            />
            <Typography variant="h4" gutterBottom>
                Selecciona tu rol
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/student')} style={{ margin: '10px' }}>
                Estudiante
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate('/teacher')} style={{ margin: '10px' }}>
                Profesor
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate('/calendar')} style={{ margin: '10px' }}>
                Calendario
            </Button>
        </Container>
    );
};

export default RoleSelection;