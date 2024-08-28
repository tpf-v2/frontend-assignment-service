import React, { useState, useEffect } from 'react';
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
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/system';
import { sendGroupForm } from '../../api/sendGroupForm';
import { getStudents } from '../../api/getStudents';
import { getTopics } from '../../api/getTopics';
import { useSelector } from 'react-redux';

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

const StudentForm = () => {
  const user = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    uid: user.id,
    uid2: undefined,
    uid3: undefined,
    uid4: undefined,
    topic1: undefined,
    topic2: undefined,
    topic3: undefined,
    selectedOption: 'selection', // Para manejar la selección de tema
    specificTopic: '',
    tutorName: '',
    tutorLastName: '',
    tutorEmail: '',
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [studentNames, setStudentNames] = useState([]);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await getTopics(user);
        setTopics(response.data);
      } catch (error) {
        console.error("Error al obtener los topics", error);
        alert('Error al obtener los topics');
      }
    };
  
    fetchTopics();
  }, []); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const padrones = [formData.uid, formData.uid2, formData.uid3, formData.uid4].filter(uid => uid);
    
    getStudents(padrones, user)
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

    const existingGroup = formData.selectedOption === 'existing' ? true : false;
    const payload = {
      user_id_sender: formData.uid,
      user_id_student_2: formData.uid2 || null,
      user_id_student_3: formData.uid3 || null,
      user_id_student_4: formData.uid4 || null,
      answer_id: new Date().toISOString(),
      topic_1: existingGroup ? formData.specificTopic : formData.topic1,
      topic_2: existingGroup ? formData.specificTopic : formData.topic2,
      topic_3: existingGroup ? formData.specificTopic : formData.topic3,
      tutor_name: existingGroup ? formData.tutorName : null,
      tutor_last_name: existingGroup ? formData.tutorLastName : null,
      tutor_email: existingGroup ? formData.tutorEmail : null,
    };
    
    try {
      const response = await sendGroupForm(payload,existingGroup, user);
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
    setOpenDialog(false);
  };

  const handleOptionChange = (e) => {
    setFormData({ ...formData, selectedOption: e.target.value });
  };

  const isTopicDisabled = (topic) => {
    return (
      formData.topic1 === topic ||
      formData.topic2 === topic ||
      formData.topic3 === topic ||
      formData.specificTopic === topic
    );
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
              label="Padrón"
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
              label="Padrón integrante 2"
              name="uid2"
              type="number"
              fullWidth
              margin="normal"
              variant="outlined"
              value={formData.uid2}
              onChange={handleChange}
            />
            <TextField
              label="Padrón integrante 3"
              name="uid3"
              type="number"
              fullWidth
              margin="normal"
              variant="outlined"
              value={formData.uid3}
              onChange={handleChange}
            />
            <TextField
              label="Padrón integrante 4"
              name="uid4"
              type="number"
              fullWidth
              margin="normal"
              variant="outlined"
              value={formData.uid4}
              onChange={handleChange}
            />
            
            <Typography variant="h6" style={{ marginTop: '20px' }}>Seleccionar opción</Typography>
            <RadioGroup value={formData.selectedOption} onChange={handleOptionChange}>
              <FormControlLabel value="selection" control={<Radio />} label="Seleccionar 3 temas" />
              <FormControlLabel value="existing" control={<Radio />} label="Ya tengo tema y tutor" />
            </RadioGroup>

            {formData.selectedOption === 'selection' && (
              <>
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
                      <MenuItem key={topic.name} value={topic.name} disabled={isTopicDisabled(topic.name) || formData.topic1 === topic.name || formData.topic2 === topic.name}>
                        {topic.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            {formData.selectedOption === 'existing' && (
              <>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>Tema Específico</InputLabel>
                  <Select
                    name="specificTopic"
                    value={formData.specificTopic}
                    onChange={handleChange}
                    label="Tema Específico"
                    required
                  >
                    {topics.map((topic) => (
                      <MenuItem key={topic.name} value={topic.name} disabled={isTopicDisabled(topic.name)}>
                        {topic.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Nombre del Tutor"
                  name="tutorName"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.tutorName}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Apellido del Tutor"
                  name="tutorLastName"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.tutorLastName}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Email del Tutor"
                  name="tutorEmail"
                  type="email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData.tutorEmail}
                  onChange={handleChange}
                  required
                />
              </>
            )}

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