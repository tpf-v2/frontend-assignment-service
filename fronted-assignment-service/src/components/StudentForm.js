import React, { useState } from 'react';
import { Typography, TextField, Button, Container, Paper, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
}));

const topics = ['Álgebra', 'Cálculo', 'Física', 'Química', 'Probabilidad', 'Estadística'];

const StudentForm = ({ studentEmail }) => {
    // Inicializa el estado del formulario con el email del estudiante.
    const [formData, setFormData] = useState({
    email: studentEmail || 'USER FORM WAS NOT ADDED YET',
    email2: '',
    email3: '',
    email4: '',
    topic1: '',
    topic2: '',
    topic3: '',
    });

    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
        email: formData.email,
        email_student_group_2: formData.email2 || null,
        email_student_group_3: formData.email3 || null,
        email_student_group_4: formData.email4 || null,
        group_id: new Date().toISOString(),
        topic1: formData.topic1,
        topic2: formData.topic2,
        topic3: formData.topic3,
    };
    
    console.log('Payload:', payload); // Print payload to console for verification

    try {
        const response = await axios.post('YOUR_BACKEND_URL', payload);
        if (response.status === 200) {
            alert('Formulario enviado con éxito');
        } else {
            alert('Error al enviar el formulario');
        }
    } catch (error) {
        console.error('Error al enviar el formulario', error);
        alert('Error al enviar el formulario');
    }
    };

    const isTopicDisabled = (topic) => {
        return formData.topic1 === topic || formData.topic2 === topic || formData.topic3 === topic;
    };

    return (
    <Container maxWidth="sm">
        <Root>
        <Title variant="h5">Formulario del Grupo</Title>
        <form onSubmit={handleSubmit}>
            <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            InputProps={{
                readOnly: true,
            }}
            required
            />
            <TextField
            label="Email integrante 2"
            name="email2"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.email2}
            onChange={handleChange}
            />
            <TextField
            label="Email integrante 3"
            name="email3"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.email3}
            onChange={handleChange}
            />
            <TextField
            label="Email integrante 4"
            name="email4"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.email4}
            onChange={handleChange}
            />
            <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Tema 1</InputLabel>
            <Select
                name="topic1"
                value={formData.topic1}
                onChange={handleChange}
                label="Tema 1"
                required
            >
                {topics.map((topic) => (
                <MenuItem key={topic} value={topic} disabled={isTopicDisabled(topic)}>
                    {topic}
                </MenuItem>
                ))}
            </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Tema 2</InputLabel>
            <Select
                name="topic2"
                value={formData.topic2}
                onChange={handleChange}
                label="Tema 2"
                required
            >
                {topics.map((topic) => (
                <MenuItem key={topic} value={topic} disabled={isTopicDisabled(topic) || formData.topic1 === topic}>
                    {topic}
                </MenuItem>
                ))}
            </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Tema 3</InputLabel>
            <Select
                name="topic3"
                value={formData.topic3}
                onChange={handleChange}
                label="Tema 3"
                required
            >
                {topics.map((topic) => (
                <MenuItem
                    key={topic}
                    value={topic}
                    disabled={isTopicDisabled(topic) || formData.topic1 === topic || formData.topic2 === topic}
                >
                    {topic}
                </MenuItem>
                ))}
            </Select>
            </FormControl>
            <ButtonStyled variant="contained" color="primary" type="submit">
            Enviar Formulario
            </ButtonStyled>
        </form>
        </Root>
    </Container>
    );
};

export default StudentForm;