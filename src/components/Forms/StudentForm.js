import React, { useState, useEffect } from "react";
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
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/system";
import { sendGroupForm } from "../../api/sendGroupForm";
import { getStudents } from "../../api/handleStudents";
import { getTopics } from "../../api/handleTopics";
import { getTutorsDataOnly } from "../../api/dashboardStats";
import { useSelector } from "react-redux";
import MySnackbar from "../UI/MySnackBar";
import { NumericFormat } from "react-number-format";
import ClosedAlert from "../ClosedAlert";
import { TitleSimple } from "../../styles/Titles";

const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const Title = TitleSimple;

const StudentForm = () => {
  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.period);

  const [formData, setFormData] = useState({
    uid: user.id,
    uid2: undefined,
    uid3: undefined,
    uid4: undefined,
    topic1: undefined,
    topic2: undefined,
    topic3: undefined,
    selectedOption: "selection", // Para manejar la selección de tema
    specificTopic: "",
    tutorName: "",
    tutorLastName: "",
    tutorEmail: "",
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [studentNames, setStudentNames] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await getTopics(period.id, user);
        const topics = response.data.filter(
          (c) => c.category.name !== "default"
        ).sort((a, b) => a.name.localeCompare(b.name)); // Sorting alphabetically;
        setTopics(topics);
      } catch (error) {
        console.error("Error al obtener los topics", error);
        setNotification({
          open: true,
          message:
            "Error al obtener los temas",
          status: "error",
        });
      }
    };
    
    const fetchTutors = async () => {
      try {
        // Obtenemos tutores y ordenamos en orden alfabético para mostrarlos en dropdown
        const fetchedTutors = await getTutorsDataOnly(period.id, user);
        const sortedTutors = fetchedTutors.sort((a, b) => a.last_name.localeCompare(b.last_name));
        setTutors(sortedTutors);
      } catch (error) {

        console.error("Error al obtener tutores", error);
        setNotification({
          open: true,
          message:
            "Error al obtener tutores",
          status: "error",
        });

      }
    }

    fetchTopics();
    fetchTutors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const padrones = [
      formData.uid,
      formData.uid2,
      formData.uid3,
      formData.uid4,
    ].filter((uid) => uid);

    getStudents(period, padrones, user)
      .then((response) => {
        setStudentNames(response.data);
        setOpenDialog(true);
      })
      .catch((error) => {
        console.error("Error al obtener los compañeros", error);
        setNotification({
          open: true,
          message:
            "Error al obtener los compañeros. Por favor revisar que los padrones sean correctos",
          status: "error",
        });
      });
  };

  const handleConfirm = async () => {
    setLoading(true);
    const existingTeam = formData.selectedOption === "existing" ? true : false;
    const payload = {
      user_id_sender: formData.uid,
      user_id_student_2: formData.uid2 || null,
      user_id_student_3: formData.uid3 || null,
      user_id_student_4: formData.uid4 || null,
      answer_id: new Date().toISOString(),
      topic_1: existingTeam ? formData.specificTopic : formData.topic1,
      topic_2: existingTeam ? formData.specificTopic : formData.topic2,
      topic_3: existingTeam ? formData.specificTopic : formData.topic3,
      tutor_name: existingTeam ? formData.tutorName : null,
      tutor_last_name: existingTeam ? formData.tutorLastName : null,
      tutor_email: existingTeam ? formData.tutorEmail : null,
    };

    try {
      const response = await sendGroupForm(period.id, payload, existingTeam, user);
      if (response.status === 201) {
        setSubmitSuccess(true);
        setOpenDialog(false);
      } else {
        setNotification({
          open: true,
          message: response.data.detail,
          status: "error",
        });
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "Error al enviar el formulario",
        status: "error",
      });
      console.error("Error al enviar el formulario", error);
    } finally {
      setLoading(false)
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
      {period.form_active ? (
        <Root>
          <Title variant="h5">Formulario de Equipo</Title>
          {submitSuccess && (
            <Alert severity="success">
              Gracias por enviar el formulario de equipo.
            </Alert>
          )}
          {!submitSuccess && (
            <form onSubmit={handleSubmit}>
              <NumericFormat
                allowNegative={false}
                fullWidth
                label="Padrón"
                name="uid"
                customInput={TextField}
                margin="normal"
                variant="outlined"
                value={formData.uid}
                onChange={handleChange}
                InputProps={{
                  readOnly: true,
                }}
                required
              />
              <NumericFormat
                allowNegative={false}
                customInput={TextField}
                label="Padrón integrante 2"
                name="uid2"
                fullWidth
                margin="normal"
                variant="outlined"
                value={formData.uid2}
                onChange={handleChange}
              />
              <NumericFormat
                allowNegative={false}
                customInput={TextField}
                label="Padrón integrante 3"
                name="uid3"
                fullWidth
                margin="normal"
                variant="outlined"
                value={formData.uid3}
                onChange={handleChange}
              />
              <NumericFormat
                allowNegative={false}
                customInput={TextField}
                label="Padrón integrante 4"
                name="uid4"
                fullWidth
                margin="normal"
                variant="outlined"
                value={formData.uid4}
                onChange={handleChange}
              />
  
              <Typography variant="h6" style={{ marginTop: "20px" }}>
                Seleccionar opción
              </Typography>
              <RadioGroup
                value={formData.selectedOption}
                onChange={handleOptionChange}
              >
                <FormControlLabel
                  value="selection"
                  control={<Radio />}
                  label="Seleccionar 3 temas"
                />
                <FormControlLabel
                  value="existing"
                  control={<Radio />}
                  label="Ya tengo tema y tutor"
                />
              </RadioGroup>
  
              {formData.selectedOption === "selection" && (
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
                        <MenuItem
                          key={topic.name}
                          value={topic.name}
                          disabled={isTopicDisabled(topic.name)}
                        >
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
                        <MenuItem
                          key={topic.name}
                          value={topic.name}
                          disabled={
                            isTopicDisabled(topic.name) ||
                            formData.topic1 === topic.name
                          }
                        >
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
                          disabled={
                            isTopicDisabled(topic.name) ||
                            formData.topic1 === topic.name ||
                            formData.topic2 === topic.name
                          }
                        >
                          {topic.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}

              {/* Ya tengo tema y tutor */}
              {formData.selectedOption === "existing" && (
                <>
                  <TextField
                    label="Tema"
                    name="specificTopic"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={formData.specificTopic}
                    onChange={handleChange}
                    required
                  />
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="Tutor" shrink>Tutor *</InputLabel> 
                    <Select
                      labelId="Tutor" // Shrink para que el label flotante se vea siempre bien arriba
                      name="tutorEmail"
                      value={formData.tutorEmail || ""} // se deja vacío y entonces (con el displayEmpty) cae al MenuItem por defecto
                      displayEmpty
                      label="Tutor"
                      onChange={handleChange}
                      required
                      fullWidth
                    >
                      <MenuItem key="" value="" // a este MenuItem cae cuando el value está vacío
                        disabled> 
                        Seleccionar tutor
                      </MenuItem>
                      {tutors.map((tutor) => {
                        const tp = tutor.tutor_periods.find((tp) => tp.period_id === period.id);
                        if (!tp) return null; // ignorar si no hay uno del period pedido
                        
                        return (
                            <MenuItem key={tutor.email} value={tutor.email}>
                            {tutor.name} {tutor.last_name}
                            </MenuItem>
                        );
                        })}

                    </Select>
                  </FormControl>
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
                ¿Estás seguro que quieres crear un equipo con los estudiantes:{" "}
                {studentNames.map((s) => `${s.name} ${s.last_name}`).join(", ")}?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button disabled={loading} onClick={handleCloseDialog} color="primary">
                Seguir Editando
              </Button>
              <Button disabled={loading} onClick={handleConfirm} color="primary">
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
        </Root>
      ) : (
        <ClosedAlert message="No se aceptan respuestas al formulario de equipos." />
      )}
      <MySnackbar
        open={notification.open}
        handleClose={handleSnackbarClose}
        message={notification.message}
        status={notification.status}
      />
    </Container>
  );
  
};

export default StudentForm;
