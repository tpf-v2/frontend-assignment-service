import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
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
} from "@mui/material";
import { useSelector } from "react-redux";
import { CalendarStyled } from "../../styles/AvailabilityCalendarStyle";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import MySnackbar from "../UI/MySnackBar";

const localizer = momentLocalizer(moment);

const Dates = () => {
  const period = useSelector((state) => state.period);
  const tutors = Object.values(useSelector((state) => state.tutors))
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos

  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState("info");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openEvaluatorDialog, setOpenEvaluatorDialog] = useState(false);
  const [selectedTutors, setSelectedTutors] = useState([]);

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

  const handleAssignDate = () => {};

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

  //   const handleSelectSlot = ({ start, end }) => {
  //     const duration = moment(end).diff(moment(start), "minutes");

  //     // Verifica si el slot es de exactamente 1 hora
  //     if (duration === 60) {
  //       console.log("Slot de 1 hora seleccionado:", start, end);
  //       // Aquí puedes agregar la lógica para guardar o manejar el slot seleccionado
  //     } else {
  //       handleSnackbarOpen("Por favor selecciona un slot de 1 hora.", "error");
  //       return;
  //     }
  //   };

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
            onClick={handleAssignDate}
            sx={{
              padding: "6px 26px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.07)",
              transition: "all 0.3s ease",
            }}
          >
            Asignar fecha a grupo
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
