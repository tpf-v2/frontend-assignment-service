import React from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import fiubaLogo from '../assets/fiuba-logo.png';

const Form = ({ role }) => {
    return (
        <Container style={{ marginTop: '50px' }}>
            <Box display="flex" justifyContent="center" mb={3}>
                <img 
                    src={fiubaLogo} 
                    alt="FIUBA Logo" 
                    style={{ width: '250px' }} 
                />
            </Box>
            <Typography variant="h4" gutterBottom style={{ color: '#0072C6'}}>
                Formulario de {role}
            </Typography>
            <form noValidate autoComplete="off">
                <TextField label="Nombre" fullWidth margin="normal" variant="outlined" />
                <TextField label="Apellido" fullWidth margin="normal" variant="outlined" />
                <TextField label="Padrón" fullWidth margin="normal" variant="outlined" />
                <Button variant="contained" color="primary" type="submit" style={{ backgroundColor: '#0072C6' }}>
                    Enviar
                </Button>
            </form>
        </Container>
    );
};

export default Form;