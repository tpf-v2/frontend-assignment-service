import React, { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import {
  Grid,
  Box,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
  Select,
  DialogContentText,
} from "@mui/material";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import MySnackbar from "../UI/MySnackBar";
import dayjs from "dayjs";
import Description from "./Dates/Description";
import ButtonSection from "./Dates/ButtonSection";
import CalendarSection from "./Dates/CalendarSection";
import LoadingDialog from "./Dates/LoadingDialog";
import EvaluatorDialog from "./Dates/EvaluatorDialog";
import SpecificDateDialog from "./Dates/SpecificDateDialog";
import {
  assignSpecificDate,
  confirmDates,
  dates,
  getAssignedDates,
} from "../../api/assignments";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import { togglePeriodSetting } from "../../redux/slices/periodSlice";
import updatePeriod from "../../api/updatePeriod";
import ResultsDialog from "./Dates/ResultsDialog";

const evaluatorColors = [
  "#87CEFA", // Light Blue
  "#90EE90", // Light Green
  "#FFD700", // Gold
  "#FF69B4", // Hot Pink
  "#20B2AA", // Light Sea Green
  "#FFA07A", // Light Salmon
  "#9370DB", // Medium Purple
];

// Función para asignar un color a cada evaluador de manera dinámica
const getEvaluatorColor = (evaluatorId, evaluatorColorMap) => {
  if (!evaluatorColorMap[evaluatorId]) {
    const colorIndex =
      Object.keys(evaluatorColorMap).length % evaluatorColors.length;
    evaluatorColorMap[evaluatorId] = evaluatorColors[colorIndex];
  }
  return evaluatorColorMap[evaluatorId];
};

const Dates = () => {
  const period = useSelector((state) => state.period);
  const user = useSelector((state) => state.user);

  const tutors = Object.values(useSelector((state) => state.tutors))
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  const groups = Object.values(useSelector((state) => state.groups))
    .sort((a, b) => a.group_number - b.group_number)
    .map(({ version, rehydrated, ...rest }) => rest)
    .filter((item) => Object.keys(item).length > 0);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState("info");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openEvaluatorDialog, setOpenEvaluatorDialog] = useState(false);
  // const [selectedTutors, setSelectedTutors] = useState([]);
  const [group, setGroup] = useState("");
  const [tutor, setTutor] = useState("");
  const [topic, setTopic] = useState("");
  const [selectedHour, setSelectedHour] = useState("");

  const [events, setEvents] = useState([]);
  const [initialEvents, setInitialEvents] = useState([]);

  // Genera las opciones de horas (ej: 9:00, 10:00, ..., 17:00)
  const hours = Array.from({ length: 13 }, (_, i) => `${9 + i}:00`);
  const [evaluador, setEvaluador] = useState("");
  const [assignDateOpenDialog, setAssignDateOpenDialog] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
  const [openRunDialog, setOpenRunDialog] = useState(false);
  const [running, setRunning] = useState(false);
  const [maxDifference, setMaxDifference] = useState("");
  const [maxGroups, setMaxGroups] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [datesResult, setDatesResult] = useState([]);
  const [isEditing, setIsEditing] = useState(null); // Almacena el id del grupo que está siendo editado
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // Dialogo para confirmar resultados
  const [selectedSlot, setSelectedSlot] = useState(null); // Estado para el slot seleccionado
  const [modalOpen, setModalOpen] = useState(false); // Estado para el EventModal

  const [evaluatorColorMap, setEvaluatorColorMap] = useState({});
  const [originalEvents, setOriginalEvents] = useState([]); // Estado para almacenar los eventos originales

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const [defaultDate, setDefaultDate] = useState(null); // Estado para la fecha predeterminada
  const [initialDefaultDate, setInitialDefaultDate] = useState(null); // Estado para la fecha predeterminada

  const [loadingDates, setLoadingDates] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoadingDates(true);
      try {
        const dates = await getAssignedDates(user, period);

        if (dates.length > 0) {
          const formattedEvents = dates.map((result) => {
            const color = getEvaluatorColor(
              result.evaluator_id,
              evaluatorColorMap
            );

            return {
              title: `Grupo ${
                result.group_number
              } - Tutor ${getTutorNameByTutorId(
                result.tutor_id
              )} - Evaluador ${getTutorNameByTutorId(result.evaluator_id)}`,
              start: new Date(result.date),
              end: new Date(new Date(result.date).getTime() + 60 * 60 * 1000), // Dura 1 hora
              color: color,
              result: result,
            };
          });

          const sortedEvents = formattedEvents.sort(
            (a, b) => a.start - b.start
          );
          if (sortedEvents.length > 0) {
            setInitialDefaultDate(new Date(sortedEvents[0].start));
          }
          setInitialEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Error fetching assigned dates:", error);
      }
      setLoadingDates(false);
    };

    fetchData();
  }, []);

  // Transforma datesResult en eventos para el calendario
  useEffect(() => {
    if (datesResult.length > 0) {
      const formattedEvents = datesResult.map((result) => {
        const color = getEvaluatorColor(result.evaluator_id, evaluatorColorMap);

        return {
          title: `Grupo ${result.group_number} - Tutor ${getTutorNameByTutorId(
            result.tutor_id
          )} - Evaluador ${getTutorNameByTutorId(result.evaluator_id)}`,
          start: new Date(result.date),
          end: new Date(new Date(result.date).getTime() + 60 * 60 * 1000), // Dura 1 hora
          color: color,
          result: result,
        };
      });

      const sortedEvents = formattedEvents.sort((a, b) => a.start - b.start);
      if (sortedEvents.length > 0) {
        setDefaultDate(new Date(sortedEvents[0].start));
      }

      setEvents(formattedEvents);
      setShowResults(true);
    }
    setRunning(false);
    setOpenDialog(false);
  }, [datesResult]);

  useEffect(() => {
    setEvaluatorColorMap((prevMap) => ({ ...prevMap }));
  }, [events]);

  const generateCSVData = () => {
    return initialEvents.map((event) => ({
      "Numero de grupo": event.result.group_number,
      "Nombre y apellido del tutor": getTutorNameByTutorId(
        event.result.tutor_id
      ),
      "Nombre y apellido del evaluador": getTutorNameByTutorId(
        event.result.evaluator_id
      ),
      Fecha: new Date(event.result.date).toLocaleDateString("es-ES"),
      Hora: new Date(event.result.date).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  };

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

  const handleCloseRunDialog = () => {
    setOpenRunDialog(false);
  };

  const handleRun = async () => {
    setOpenRunDialog(true);
  };

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  const handleRunAlgorithm = async () => {
    try { 
      setRunning(true);
      setOpenDialog(true);
      setOpenRunDialog(false);
      setShowResults(false);

      console.log("Running the algorithm!");

      const response = await dates(user, period, maxDifference, maxGroups);

      setDatesResult(response.assigments);
    } catch (error) {
      console.error("Error running algorithm:", error);
      setErrorDialogOpen(true);
      setRunning(false);
    }
  };

  const handleSelectEvaluators = () => {
    setOpenEvaluatorDialog(true);
  };

  const handleEvaluatorDialogClose = () => {
    setOpenEvaluatorDialog(false);
  };

  function formatUpdatedDateTime(dateTimeString, timeString) {
    // Convierte la fecha y hora completa en un objeto Date
    const date = new Date(dateTimeString);

    // Extrae horas y minutos de la cadena de tiempo
    const [hours, minutes] = timeString.split(":").map(Number);

    // Sobrescribe la hora, minutos y segundos de la fecha original
    date.setUTCHours(hours, minutes, 0, 0);

    // Devuelve la fecha en formato ISO sin la clave
    return date.toISOString();
  }

  const handleAssignDate = async () => {
    if (!group || !evaluador || !selectedDateTime || !selectedHour) {
      handleSnackbarOpen(
        "Por favor completa todos los campos antes de asignar.",
        "error"
      );
      return;
    }

    const tutor = tutors.find(
      (t) =>
        t.tutor_periods &&
        t.tutor_periods.some(
          (tp) => tp.period_id === period.id && tp.id === group.tutor_period_id
        )
    );
    try {
      await assignSpecificDate(
        user,
        group.id,
        tutor.id,
        evaluador,
        formatUpdatedDateTime(selectedDateTime, selectedHour),
        period.id
      );
      handleSnackbarOpen("Fecha asignada correctamente", "success");
      const color = getEvaluatorColor(evaluador, evaluatorColorMap);

      const newEvent = {
        title: `Grupo ${group.group_number} - Tutor ${getTutorNameByTutorId(
          tutor.id
        )} - Evaluador ${getTutorNameByTutorId(evaluador)}`,
        start: new Date(
          new Date(formatUpdatedDateTime(selectedDateTime, selectedHour)).getTime() +
            60 * 60 * 1000 * 3
        ),
        end: new Date(
          new Date(formatUpdatedDateTime(selectedDateTime, selectedHour)).getTime() +
            60 * 60 * 1000 * 4
        ), // Dura 1 hora
        color: color,
        result: {
          date: new Date(
            new Date(formatUpdatedDateTime(selectedDateTime, selectedHour)).getTime() +
              60 * 60 * 1000 * 3
          ),
          evaluator_id: evaluador,
          group_id: group.id,
          group_number: group.group_number,
          tutor_id: tutor.id,
        },
      };
      // Actualizar el evento si existe, o agregar uno nuevo si no existe
    setInitialEvents((prevEvents) => {
      const eventIndex = prevEvents.findIndex(
        (event) => event.result.group_id === group.id
      );

      if (eventIndex !== -1) {
        // Si el evento existe, actualiza el start y end
        const updatedEvents = [...prevEvents];
        updatedEvents[eventIndex] = {
          ...updatedEvents[eventIndex],
          start: newEvent.start,
          end: newEvent.end,
        };
        return updatedEvents;
      } else {
        // Si no existe, agrega el nuevo evento
        return [...prevEvents, newEvent];
      }
    });
    } catch (e) {
      handleSnackbarOpen("Hubo un error al asignar la fecha.", "error");
    } finally {
      setAssignDateOpenDialog(false); // Cerrar el diálogo después de asignar
    }
  };

  const getTutorNameById = (id, periodId) => {
    const tutor = tutors.find(
      (t) =>
        t.tutor_periods &&
        t.tutor_periods.some((tp) => tp.period_id === periodId && tp.id === id)
    );

    return tutor ? tutor.name + " " + tutor.last_name : "Sin asignar"; // Si no encuentra el tutor, mostrar 'Sin asignar'
  };

  const getTutorNameByTutorId = (tutor_id) => {
    const tutor = tutors.find((t) => t.id === tutor_id);

    return tutor ? tutor.name + " " + tutor.last_name : "Sin asignar"; // Si no encuentra el tutor, mostrar 'Sin asignar'
  };

  const handleCloseResults = () => {
    setShowResults(false);
  };

  // Manejo del popup de confirmación
  const handleConfirmResults = async () => {
    setOpenConfirmDialog(true); // Abrir el popup de confirmación
  };

  const filteredTutors = tutors.filter((tutor) =>
    tutor.tutor_periods.some(
      (tutor_period) =>
        tutor_period.period_id === period.id && tutor_period.is_evaluator
    )
  );

  const handleAssignEspecificDate = () => {
    setAssignDateOpenDialog(true);
  };

  const handleStartEditing = () => {
    setOriginalEvents([...events]); // Guarda una copia de eventos antes de empezar a editar
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setEvents(originalEvents); // Restaura la copia original
    setIsEditing(false); // Sale del modo de edición
  };

  const handleSaveChanges = () => {
    const groupDateCount = {};

    events.forEach((event) => {
      const groupId = event.result.group_id;
      groupDateCount[groupId] = (groupDateCount[groupId] || 0) + 1;
    });

    // Verificar si algún grupo tiene más de una fecha asignada
    const hasMultipleDates = Object.values(groupDateCount).some(
      (count) => count > 1
    );

    if (hasMultipleDates) {
      handleSnackbarOpen(
        "No se pueden guardar los cambios. Hay grupos con más de una fecha asignada.",
        "error"
      );
      return;
    }

    setIsEditing(false);
    handleSnackbarOpen("Cambios guardados exitosamente", "success");
  };

  const handleRerunAlgorithm = () => {
    setErrorDialogOpen(false);
    setShowResults(false); // Cierra el diálogo de resultados
    setMaxDifference(""); // Reinicia el valor del límite máximo
    setMaxGroups("");
    handleRun(); // Abre el diálogo para seleccionar el límite máximo
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false); // Cerrar el popup de confirmación
  };

  const handleAcceptResults = async () => {
    await confirmDates(user, events, period.id);

    dispatch(
      togglePeriodSetting({ field: "presentation_dates_assignment_completed" })
    );

    // Crea el objeto de configuración actualizado
    const updatedSettings = {
      id: period.id,
      ...period,
      presentation_dates_assignment_completed: true, // Actualización directa
    };

    // Llama a la función de actualización del período
    const result = await updatePeriod(updatedSettings, user);
    console.log("Updated successfully:", result);

    setOpenConfirmDialog(false); // Cerrar el popup de confirmación
    setShowResults(false);

    setInitialEvents((prevEvents) => [...prevEvents, ...events]);
  };

  const handleSelectSlot = ({ start, end }) => {
    if (isEditing) {
      const duration = (end - start) / (1000 * 60); // Duración en minutos

      // Verificar que la duración sea exactamente de 60 minutos
      if (duration !== 60) {
        handleSnackbarOpen(
          "El evento seleccionado debe ser de una hora.",
          "error"
        );
        return;
      }

      const isEventOverlap = events.some(
        (event) => start < event.end && end > event.start
      );

      if (isEventOverlap) {
        handleSnackbarOpen(
          "El evento se solapa con otro existente. Por favor, selecciona un intervalo diferente.",
          "error"
        );
        return;
      }

      // Guardar el intervalo seleccionado
      setSelectedSlot({ start, end });
      setModalOpen(true); // Abrir el modal para confirmar
    }
  };

  const handleSelectEvent = (event) => {
    if (isEditing) {
      setEventToDelete(event);
      setConfirmDeleteOpen(true);
    }
  };

  const handleDeleteEvent = async () => {
    if (eventToDelete) {
      const updatedEvents = events.filter(
        (event) =>
          event.start !== eventToDelete.start || event.end !== eventToDelete.end
      );
      setConfirmDeleteOpen(false);
      setEvents(updatedEvents);
    }
  };

  const handleConfirmEvent = async () => {
    if (selectedSlot && group) {
      const groupTutor = tutors.find(
        (t) =>
          t.tutor_periods &&
          t.tutor_periods.some(
            (tp) =>
              tp.period_id === period.id && tp.id === group.tutor_period_id
          )
      );
      const color = getEvaluatorColor(evaluador, evaluatorColorMap);

      const newEvent = {
        title: `Grupo ${group.group_number} - Tutor ${getTutorNameByTutorId(
          groupTutor.id
        )} - Evaluador ${getTutorNameByTutorId(evaluador)}`,
        start: selectedSlot.start,
        end: selectedSlot.end,
        color: color,
        result: {
          date: selectedSlot.start,
          evaluator_id: evaluador,
          group_id: group.id,
          tutor_id: groupTutor.id,
        },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      setModalOpen(false);
    }
  };

  const parameters_to_complete = () => {
   return (
       <>
        <DialogContent>
          <TextField
            margin="dense"
            label="Límite máximo en la diferencia"
            type="number"
            fullWidth
            value={maxDifference}
            onChange={(e) => setMaxDifference(e.target.value)}
          />
          <TextField
            // autoFocus
            margin="dense"
            label="Máximo grupos por semana"
            type="number"
            fullWidth
            value={maxGroups}
            onChange={(e) => setMaxGroups(e.target.value)}
          />
        </DialogContent>
        </>)
  }
        
  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2}>
        {/* Descripción */}
        <Description />
        {/* Botones Correr */}
        <ButtonSection
          handleSelectEvaluators={handleSelectEvaluators}
          handleAssignEspecificDate={handleAssignEspecificDate}
          handleRun={handleRun}
          period={period}
        />
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
        {initialEvents.length > 0 && (
          <Button
            variant="outlined"
            // onClick={() => navigate(`/dashboard/${period.id}/groups`)}
            sx={{
              padding: "6px 16px",
              textTransform: "none", // Evitar que el texto esté en mayúsculas
            }}
          >
            <CSVLink
              data={generateCSVData()}
              filename={`Calendario_Resultados_${new Date().toLocaleDateString(
                "es-ES"
              )}.csv`}
              className="btn btn-primary"
              target="_blank"
              style={{
                textDecoration: "none", // Quitar el estilo de enlace
                color: "inherit", // Heredar el color del botón
              }}
            >
              Descargar calendario como CSV
            </CSVLink>
          </Button>
        )}
      </Grid>

      {/* Sección de Tabla y Botón a la derecha */}
      <Grid item xs={12}>
        <CalendarSection
          events={initialEvents}
          defaultDate={initialDefaultDate}
          loadingDates={loadingDates}
        />
      </Grid>

      {/* Spinner de carga */}
      <LoadingDialog
        open={openDialog}
        setOpenDialog={setOpenDialog}
        loading={running}
      />

      <EvaluatorDialog
        user={user}
        open={openEvaluatorDialog}
        handleClose={handleEvaluatorDialogClose}
        handleEvaluatorDialogClose={handleEvaluatorDialogClose}
      />

      <SpecificDateDialog
        open={assignDateOpenDialog}
        onClose={() => setAssignDateOpenDialog(false)}
        groups={groups}
        period={period}
        tutor={tutor}
        topic={topic}
        evaluador={evaluador}
        setEvaluador={setEvaluador}
        selectedDateTime={selectedDateTime}
        setSelectedDateTime={setSelectedDateTime}
        selectedHour={selectedHour}
        setSelectedHour={setSelectedHour}
        handleAssignDate={handleAssignDate}
        getTutorNameById={getTutorNameById}
        hours={hours}
        tutors={tutors}
        group={group}
        setGroup={setGroup}
        setTutor={setTutor}
        setTopic={setTopic}
      />

      <ResultsDialog
        open={showResults}
        onClose={handleCloseResults}
        events={events}
        isEditing={isEditing}
        handleStartEditing={handleStartEditing}
        handleCancelEditing={handleCancelEditing}
        handleSaveChanges={handleSaveChanges}
        handleCloseResults={handleCloseResults}
        handleSelectSlot={handleSelectSlot}
        handleSelectEvent={handleSelectEvent}
        defaultDate={defaultDate}
        handleRerunAlgorithm={handleRerunAlgorithm}
        handleConfirmResults={handleConfirmResults}
        getTutorNameByTutorId={getTutorNameByTutorId}
      />

      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDeleteEvent}
      />

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Asignar Fecha a Grupo</DialogTitle>

        <DialogContent>
          <Grid container spacing={3}>
            {/* Selección de Grupo */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Grupo</Typography>
              <Select
                fullWidth
                displayEmpty
                value={group.group_number}
                onChange={(e) => {
                  const selectedGroup = groups.find(
                    (g) => g.group_number === e.target.value
                  );
                  setGroup(selectedGroup);

                  const selectedTutor = getTutorNameById(
                    selectedGroup.tutor_period_id,
                    period.id
                  );
                  setTutor(selectedTutor ? selectedTutor : "");
                  setTopic(selectedGroup.topic ? selectedGroup.topic.name : "[No tiene tema asignado.]");
                }}
                renderValue={(selected) => {
                  const selectedGroup = groups.find(
                    (g) => g.group_number === selected
                  );
                  return selectedGroup
                    ? `Grupo ${selectedGroup.group_number}`
                    : "Selecciona un Grupo";
                }}
              >
                {groups.map((group) => (
                  <MenuItem key={group.id} value={group.group_number}>
                    {`Grupo ${group.group_number}`}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {/* Tutor y Tema */}
            <Grid item xs={12} md={12}>
              <TextField
                label="Tutor"
                value={tutor}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="filled"
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                label="Tema"
                value={topic}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="filled"
              />
            </Grid>

            {/* Selección de Evaluador */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Evaluador</Typography>
              <Select
                fullWidth
                displayEmpty
                value={evaluador}
                onChange={(e) => setEvaluador(e.target.value)}
              >
                {filteredTutors.map((tutor) => (
                  <MenuItem key={tutor.id} value={tutor.id}>
                    {`${tutor.name} ${tutor.last_name}`}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            onClick={() => setModalOpen(false)}
            color="error"
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmEvent}
            color="primary"
            variant="contained"
          >
            Asignar
          </Button>
        </DialogActions>
      </Dialog>
            
      
      <Dialog open={openRunDialog} onClose={handleCloseRunDialog}>

      <DialogTitle>
          Seleccione la diferencia de grupos entre evaluadores y el límite
          máximo de grupos por semana
        </DialogTitle>

        <Alert severity="error">            
          {"Esta funcionalidad está en mantenimiento, estará disponible a la brevedad."}
        </Alert>

        {parameters_to_complete()}

        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            onClick={handleCloseRunDialog}
            color="error"
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleRunAlgorithm}
            color="primary"
            variant="contained"
            disabled={true} // HOTFIX: HASTA QUE FUNCIONE LA EJECUCIÓN DEL ALGORITMO DE FECHAS
          >
            Correr
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popup de Confirmación */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirmar Resultados</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Importante: Al confirmar los resultados no podrá volver a correr el
            algoritmo ni editar las fechas de presentación.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            onClick={handleCloseConfirmDialog}
            color="error"
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAcceptResults}
            color="primary"
            variant="contained"
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={errorDialogOpen} onClose={handleCloseErrorDialog}>
        <DialogTitle>{"Error al ejecutar el algoritmo"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ocurrió un error al intentar correr el algoritmo. Por favor, ajusta
            los parámetros e intenta nuevamente.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseErrorDialog}
            color="error"
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleRerunAlgorithm}
            color="primary"
            variant="contained"
          >
            Reintentar
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
