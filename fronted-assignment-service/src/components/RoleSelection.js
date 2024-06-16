import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
    const navigate = useNavigate();

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Selecciona tu rol
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/student')}>
                Estudiante
            </Button>
            <Button variant="contained" color="secondary" onClick={() => navigate('/teacher')}>
                Profesor
            </Button>
        </Container>
    );
};

export default RoleSelection;