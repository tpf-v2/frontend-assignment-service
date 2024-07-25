import React, { useState } from 'react';
import { Typography, TextField, Button, Container, Paper, FormControl, InputLabel, Select, MenuItem, Box, Alert } from '@mui/material';
import { styled } from '@mui/system';
import { sendGroupForm } from '../../api/sendGroupForm'; // Importa la función desde api.js

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

const StudentForm = ({ studentUid }) => {
  const [formData, setFormData] = useState({
    uid: studentUid || "000000",
    uid2: '',
    uid3: '',
    uid4: '',
    topic1: '',
    topic2: '',
    topic3: '',
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [companionNames, setCompanionNames] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      uid_sender: formData.uid,
      uid_student_2: formData.uid2 || null,
      uid_student_3: formData.uid3 || null,
      uid_student_4: formData.uid4 || null,
      group_id: new Date().toISOString(),
      topic_1: formData.topic1,
      topic_2: formData.topic2,
      topic_3: formData.topic3,
    };
    
    console.log('Payload:', payload); // Print payload to console for verification

    try {
      const response = await sendGroupForm(payload);
      if (response.status === 201) {
        setSubmitSuccess(true);
        setCompanionNames(response.data.companions); // Asume que el backend devuelve un array de compañeros con 'name' y 'lastName'
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
        {submitSuccess && (
          <Alert severity="success">
            Gracias por enviar el formulario de grupo, tus compañeros son:
            <ul>
              {companionNames.map((companion, index) => (
                <li key={index}>
                  {companion.name} {companion.lastName}
                </li>
              ))}
            </ul>
          </Alert>
        )}
        {!submitSuccess && (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Padron"
              name="uid"
              type="number"
              fullWidth
              margin="normal"
              variant="outlined"
              value={formData.uid}
              onChange={handleChange}
              InputProps={{
                readOnly: true,
              }}
              required
            />
            <TextField
              label="Padron integrante 2"
              name="uid2"
              type="number"
              fullWidth
              margin="normal"
              variant="outlined"
              value={formData.uid2}
              onChange={handleChange}
            />
            <TextField
              label="Padron integrante 3"
              name="uid3"
              type="number"
              fullWidth
              margin="normal"
              variant="outlined"
              value={formData.uid3}
              onChange={handleChange}
            />
            <TextField
              label="Padron integrante 4"
              name="uid4"
              type="number"
              fullWidth
              margin="normal"
              variant="outlined"
              value={formData.uid4}
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
        )}
      </Root>
    </Container>
  );
};

export default StudentForm;