import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { useSelector } from "react-redux";
import { CalendarStyled } from "../../styles/AvailabilityCalendarStyle";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import MySnackbar from "../UI/MySnackBar";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const localizer = momentLocalizer(moment);

const Dates = () => {
  const period = useSelector((state) => state.period);
  const tutors = Object.values(useSelector((state) => state.tutors))
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  const groups = Object.values(useSelector((state) => state.groups))
    .sort((a, b) => a.id - b.id)
    .map(({ version, rehydrated, ...rest }) => rest)
    .filter((item) => Object.keys(item).length > 0);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState("info");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openEvaluatorDialog, setOpenEvaluatorDialog] = useState(false);
  const [selectedTutors, setSelectedTutors] = useState([]);
  const [group, setGroup] = useState("");
  const [tutor, setTutor] = useState("");
  const [topic, setTopic] = useState("");
  const [selectedHour, setSelectedHour] = useState("");

  // Genera las opciones de horas (ej: 9:00, 10:00, ..., 17:00)
  const hours = Array.from({ length: 13 }, (_, i) => `${9 + i}:00`);
  const [evaluador, setEvaluador] = useState("");
  const [assignDateOpenDialog, setAssignDateOpenDialog] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(dayjs());

  useEffect(() => {
    const initialSelectedTutors = tutors
      .filter((tutor) =>
        tutor.tutor_periods.some(
          (tutorPeriod) =>
            tutorPeriod.period_id === period.id && tutorPeriod.is_evaluator
        )
      )
      .map((tutor) => tutor.id);
    setSelectedTutors(initialSelectedTutors);
  }, []);

  const handleSnackbarOpen = (message, status = "info") => {
    setSnackbarMessage(message);
    setSnackbarStatus(status);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleHourChange = (event) => {
    setSelectedHour(event.target.value);
  };

  const handleRun = async () => {
    try {
      // Inicia la carga y abre el diálogo
      setLoading(true);
      setOpenDialog(true);
      console.log("Running the algorithm!");
    } catch (error) {
      // Manejo de errores global
      console.error("Error when running availability algorithm:", error);
    } finally {
      // Finaliza la carga independientemente de si hubo un error o no
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const handleSelectEvaluators = () => {
    setOpenEvaluatorDialog(true);
  };

  const handleEvaluatorDialogClose = () => {
    setOpenEvaluatorDialog(false);
  };

  const handleAssignDate = () => {
    console.log("Fecha y hora asignada:", selectedDateTime);
    console.log("Hora:", selectedHour);
    console.log("Grupo", group);
    console.log("Evaluador", evaluador);

    if (!group || !evaluador || !selectedDateTime || !selectedHour) {
      handleSnackbarOpen("Por favor completa todos los campos antes de asignar.", "error");
      return;
    }

    //TODO: call backend

    setAssignDateOpenDialog(false); // Cerrar el diálogo después de asignar
  };

  const handleToggleTutor = (tutor) => {
    setSelectedTutors((prevSelectedTutors) => {
      if (prevSelectedTutors.includes(tutor.id)) {
        // Si ya está seleccionado, lo quita de la lista
        return prevSelectedTutors.filter((id) => id !== tutor.id);
      } else {
        // Si no está seleccionado, lo agrega
        return [...prevSelectedTutors, tutor.id];
      }
    });
  };

  const getTutorNameById = (id, periodId) => {
    const tutor = tutors.find(
      (t) =>
        t.tutor_periods &&
        t.tutor_periods.some((tp) => tp.period_id === periodId && tp.id === id)
    );

    return tutor ? tutor.name + " " + tutor.last_name : "Sin asignar"; // Si no encuentra el tutor, mostrar 'Sin asignar'
  };

  const filteredTutors = tutors.filter((tutor) =>
    tutor.tutor_periods.some(
      (tutor_period) =>
        tutor_period.period_id === period.id && tutor_period.is_evaluator
    )
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2}>
        {/* Descripción */}
        <Grid item xs={12} md={12} sx={{ display: "flex" }}>
          {/* <Paper elevation={3} sx={{ padding: 2, flexGrow: 1 }}> */}
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Descripción
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} sx={{ display: "flex" }}>
          <Typography variant="body1" sx={{ textAlign: "justify" }}>
            Este algoritmo emplea programación lineal para asignar fechas de
            presentación a grupos de estudiantes, considerando la disponibilidad
            de tutores y evaluadores. Su objetivo es garantizar que todos los
            grupos reciban una fecha de exposición dentro del rango disponible.
            Además, el algoritmo distribuye equitativamente la carga de trabajo
            entre los evaluadores, asegurando una asignación justa y balanceada.
          </Typography>
        </Grid>
        {/* Botones Correr */}
        <Grid
          container
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 3, // Espacio entre los botones
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSelectEvaluators}
            sx={{
              padding: "6px 26px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.07)",
              transition: "all 0.3s ease",
            }}
          >
            Seleccionar evaluadores
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setAssignDateOpenDialog(true)}
            sx={{
              padding: "6px 26px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.07)",
              transition: "all 0.3s ease",
            }}
          >
            Asignar fecha y hora a grupo
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleRun}
            disabled={period.presentation_dates_assignment_completed}
            sx={{
              padding: "6px 26px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
            }}
          >
            Correr
          </Button>
        </Grid>

        {/* </Paper> */}
      </Grid>

      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
      </Grid>

      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Resultados
        </Typography>
      </Grid>

      {/* Sección de Tabla y Botón a la derecha */}
      <Grid item xs={12}>
        <CalendarStyled
          localizer={localizer}
          // events={events}
          selectable
          //   onSelectSlot={handleSelectSlot}
          // onSelectEvent={handleSelectEvent}
          views={["week"]}
          defaultView="week"
          timeslots={1}
          step={60}
          showMultiDayTimes
          defaultDate={new Date()}
          style={{ height: "500px", margin: "50px" }}
          min={new Date(0, 0, 0, 9, 0, 0)} // Comienza a las 9 AM
          max={new Date(0, 0, 0, 21, 0, 0)} // Termina a las 9 PM
          components={{
            month: {
              header: () => null,
            },
          }}
          dayPropGetter={(date) => {
            const day = date.getDay();
            if (day === 0 || day === 6) {
              // sábado y domingo
              return { style: { display: "none" } }; // Ocultar este día
            }
            return {};
          }}
          onNavigation={(date) => {
            const day = date.getDay();
            if (day === 0 || day === 6) {
              return false;
            }
          }}
        />
      </Grid>

      {/* Spinner de carga */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          height: "100%",
          maxHeight: "100vh",
        }}
      >
        <DialogTitle>
          {!loading && "Fechas de Presentación Asignadas"}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            minHeight: "300px",
            maxHeight: "100vh",
            minWidth: "300px",
          }}
        >
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>
                Asignando Fechas de Presentación...
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={openEvaluatorDialog}
        onClose={handleEvaluatorDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Selecciona los Evaluadores</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <List>
                {tutors.slice(0, Math.ceil(tutors.length / 3)).map((tutor) => (
                  <ListItem
                    key={tutor.id}
                    button
                    onClick={() => handleToggleTutor(tutor)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={selectedTutors.includes(tutor.id)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={tutor.name + " " + tutor.last_name}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={4}>
              <List>
                {tutors
                  .slice(
                    Math.ceil(tutors.length / 3),
                    Math.ceil((2 * tutors.length) / 3)
                  )
                  .map((tutor) => (
                    <ListItem
                      key={tutor.id}
                      button
                      onClick={() => handleToggleTutor(tutor)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={selectedTutors.includes(tutor.id)}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={tutor.name + " " + tutor.last_name}
                      />
                    </ListItem>
                  ))}
              </List>
            </Grid>
            <Grid item xs={4}>
              <List>
                {tutors
                  .slice(Math.ceil((2 * tutors.length) / 3))
                  .map((tutor) => (
                    <ListItem
                      key={tutor.id}
                      button
                      onClick={() => handleToggleTutor(tutor)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={selectedTutors.includes(tutor.id)}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={tutor.name + " " + tutor.last_name}
                      />
                    </ListItem>
                  ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEvaluatorDialogClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              //TODO: call backend
              handleEvaluatorDialogClose();
              console.log("Evaluadores seleccionados:", selectedTutors);
            }}
            color="primary"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={assignDateOpenDialog}
        onClose={() => setAssignDateOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Asignar Fecha a Grupo</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Selecciona un Grupo:</Typography>
              <Select
                fullWidth
                value={group.id}
                onChange={(e) => {
                  const selectedGroup = groups.find(
                    (g) => g.id === e.target.value
                  );
                  setGroup(selectedGroup);

                  const selectedTutor = getTutorNameById(
                    selectedGroup.tutor_period_id,
                    period.id
                  ); // Asegúrate de tener el tutor_id.
                  setTutor(selectedTutor ? selectedTutor : ""); // Ajusta según tu estructura
                  const selectedTopic = selectedGroup.topic.name; // Asegúrate de que topic exista en el grupo.
                  setTopic(selectedTopic);
                }}
                renderValue={(selected) => {
                  const selectedGroup = groups.find((g) => g.id === selected); // Encontramos el grupo correspondiente
                  return selectedGroup ? `Grupo ${selectedGroup.id}` : ""; // Mostramos "Grupo id"
                }}
              >
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {" "}
                    {/* Aquí usamos el id como value */}
                    {"Grupo " + group.id}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Tutor"
                value={tutor}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tema"
                value={topic}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                Selecciona un Evaluador:
              </Typography>
              <Select
                fullWidth
                value={evaluador}
                onChange={(e) => setEvaluador(e.target.value)}
              >
                {filteredTutors.map((tutor) => (
                  <MenuItem key={tutor.id} value={tutor.id}>
                    {tutor.name + " " + tutor.last_name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={5}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  // renderInput={(props) => <TextField {...props} />}
                  label="Selecciona la Fecha"
                  value={selectedDateTime}
                  onChange={(newValue) => setSelectedDateTime(newValue)}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={5}>
              <Select
                value={selectedHour || ""}
                onChange={handleHourChange}
                displayEmpty
                fullWidth
              >
                <MenuItem value="" disabled>
                  Selecciona la Hora
                </MenuItem>
                {hours.map((hour) => (
                  <MenuItem key={hour} value={hour}>
                    {hour}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAssignDateOpenDialog(false)}
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => handleAssignDate()}
            color="primary"
          >
            Asignar
          </Button>
        </DialogActions>
      </Dialog>

      <MySnackbar
        message={snackbarMessage}
        status={snackbarStatus}
        open={snackbarOpen}
        handleClose={handleSnackbarClose}
      />
      {/* </Grid> */}
    </Box>
  );
};

export default Dates;
