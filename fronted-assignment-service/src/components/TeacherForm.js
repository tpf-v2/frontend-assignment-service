import React from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';

const TeacherForm = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Formulario
            </Typography>
            <form noValidate autoComplete="off">
                <TextField label="Nombre" fullWidth margin="normal" />
                <TextField label="Apellido" fullWidth margin="normal" />
                <TextField label="Padrón" fullWidth margin="normal" />
                <Button variant="contained" color="primary" type="submit">Enviar</Button>
            </form>
        </Container>
    );
};

export default TeacherForm;