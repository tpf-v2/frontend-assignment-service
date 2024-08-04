import React, { useState, useEffect } from 'react'; // Importa useEffect
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { styled } from '@mui/system';
import { sendGroupForm } from '../../api/sendGroupForm'; // Importa la función desde api.js
import { getStudents } from '../../api/getStudents'; // Importa la nueva función para obtener nombres
import { getTopics } from '../../api/getTopics'; // Importa la nueva función para obtener topics

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

const StudentForm = ({ studentUid }) => {
  const [formData, setFormData] = useState({
    uid: studentUid || "105001",
    uid2: undefined,
    uid3: undefined,
    uid4: undefined,
    topic1: undefined,
    topic2: undefined,
    topic3: undefined,
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // Estado para controlar el diálogo
  const [studentNames, setStudentNames] = useState([]);
  const [topics, setTopics] = useState([]); // Estado para los topics

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await getTopics();
        setTopics(response.data); // Asume que el backend devuelve un array de topics
      } catch (error) {
        console.error("Error al obtener los topics", error);
        alert('Error al obtener los topics');
      }
    };
  
    fetchTopics();
  }, []); // Fetch topics only on component mount

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const padrones = [formData.uid, formData.uid2, formData.uid3, formData.uid4].filter(uid => uid);
    
    getStudents(padrones)
      .then(response => {
        setStudentNames(response.data);
        setOpenDialog(true);
      })
      .catch(error => {
        console.error("Error al obtener los compañeros", error);
        alert('Error al obtener los compañeros');
      });
  };

  const handleConfirm = async () => {
    const payload = {
      user_id_sender: formData.uid,
      user_id_student_2: formData.uid2 || null,
      user_id_student_3: formData.uid3 || null,
      user_id_student_4: formData.uid4 || null,
      answer_id: new Date().toISOString(),
      topic_1: formData.topic1,
      topic_2: formData.topic2,
      topic_3: formData.topic3,
    };
    
    try {
      const response = await sendGroupForm(payload);
      if (response.status === 201) {
        setSubmitSuccess(true);
        setOpenDialog(false);
      } else {
        alert('Error al enviar el formulario');
      }
    } catch (error) {
      console.error('Error al enviar el formulario', error);
      alert('Error al enviar el formulario');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Cerrar el diálogo sin enviar
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
            Gracias por enviar el formulario de grupo.
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
                  <MenuItem key={topic.name} value={topic.name} disabled={isTopicDisabled(topic.name)}>
                    {topic.name}
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
                  <MenuItem key={topic.name} value={topic.name} disabled={isTopicDisabled(topic.name) || formData.topic1 === topic.name}>
                    {topic.name}
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
                    key={topic.name}
                    value={topic.name}
                    disabled={isTopicDisabled(topic.name) || formData.topic1 === topic.name || formData.topic2 === topic.name}
                  >
                    {topic.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <ButtonStyled variant="contained" color="primary" type="submit">
              Enviar Formulario
            </ButtonStyled>
          </form>
        )}

        {/* Diálogo de Confirmación */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Confirmar Envío</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              ¿Estás seguro que quieres crear un grupo con los estudiantes: {studentNames.map(s => `${s.name} ${s.last_name}`).join(', ')}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Seguir Editando
            </Button>
            <Button onClick={handleConfirm} color="primary">
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </Root>
    </Container>
  );
};

export default StudentForm;