import React, { useEffect, useState } from "react";
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

import { getInputAnalysis } from "../../api/handleAlgorithmAnalysis";
import { DatesPreCheck } from "./SpecificAlgorithmsPreCheck";

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

const Dates = ({setSelectedMenu}) => {
  const period = useSelector((state) => state.period);
  const user = useSelector((state) => state.user);

  const tutors = Object.values(useSelector((state) => state.tutors))
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  const teams = Object.values(useSelector((state) => state.groups))
    .sort((a, b) => a.group_number - b.group_number)
    .map(({ version, rehydrated, ...rest }) => rest)
    .filter((item) => Object.keys(item).length > 0);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState("info");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openEvaluatorDialog, setOpenEvaluatorDialog] = useState(false);
  // const [selectedTutors, setSelectedTutors] = useState([]);
  const [team, setTeam] = useState("");
  const [tutor, setTutor] = useState("");
  const [topic, setTopic] = useState("");
  const [evaluator, setEvaluator] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
  const [selectedHour, setSelectedHour] = useState("");

  const [events, setEvents] = useState([]);
  const [initialEvents, setInitialEvents] = useState([]);

  // Genera las opciones de horas (ej: 9:00, 10:00, ..., 17:00)
  const hours = Array.from({ length: 13 }, (_, i) => `${9 + i}:00`);

  const [assignDateOpenDialog, setAssignDateOpenDialog] = useState(false);
  const [openRunDialog, setOpenRunDialog] = useState(false);
  const [running, setRunning] = useState(false);
  const [maxDifference, setMaxDifference] = useState("");
  const [maxTeams, setMaxTeams] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [datesResult, setDatesResult] = useState([]);
  const [isEditing, setIsEditing] = useState(null); // Almacena el id del equipo que está siendo editado
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

  const [inputInfo, setInputInfo] = useState();

  const dispatch = useDispatch();

  // Fechas
  useEffect(() => {
    
    // Análsis del input del algoritmo, previo a ejecutarlo
    const getInputInfo = async () => {
      const endpoint = "/dates_algorithm_input_info"
      try {
        setLoadingDates(true);
        const data = await getInputAnalysis(endpoint, period.id, user);        
        setInputInfo(data);
        console.log("--- seteo input info:", data);

      } catch (error) {
        setLoadingDates(false);
        console.error("Error al obtener datos del input:", error);
      }
    };   

    // Fechas
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

            // Es otro componente, como el del modal de confirmar resultados (pero cambian las start y end)
            // Fetch, debajo del botón Correr se muestran estos resultados
            return {
              title: `Equipo ${
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
        setLoadingDates(false);
      }
    };

    // Dos acciones, cada una setea loading a false en caso de error, y en caso de éxito se
    // lo setea en false recién acá abajo al final de las dos para esperar a ambas
    fetchData();
    getInputInfo();    
    setLoadingDates(false);
  }, [period, user]);

  // Transforma datesResult en eventos para el calendario
  useEffect(() => {
    if (datesResult.length > 0) {
      const formattedEvents = datesResult.map((result) => {
        const color = getEvaluatorColor(result.evaluator_id, evaluatorColorMap);

        // Rectangulitos de colores (resultados) en el modal de confirmación, y su onhover
        return {
          title: `Equipo ${result.group_number} - Tutor ${getTutorNameByTutorId(
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

  const generateCSVData = () => { // botón csv de afuera, hay otro en el modal de confirmar resultados
    return initialEvents.map((event) => ({
      "Numero de equipo": event.result.group_number,
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

      const response = await dates(user, period, maxDifference, maxTeams);
      console.log("---response:", response);

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

  // Busca los datos del equipo, hace request para agregar la asignación manual,
  // y crea y agrega el resultado de color al estado que renderiza el componente de resultados
  const handleAssignDate = async () => {    
    if (!team || !evaluator || !selectedDateTime || !selectedHour) {
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
          (tp) => tp.period_id === period.id && tp.id === team.tutor_period_id
        )
    );
    try {
      await assignSpecificDate(
        user,
        team.id,
        tutor.id,
        evaluator,
        formatUpdatedDateTime(selectedDateTime, selectedHour),
        period.id
      );
      handleSnackbarOpen("Fecha asignada correctamente", "success");
      // El resultado luego de asignar fecha a un equipo manualmente
      const color = getEvaluatorColor(evaluator, evaluatorColorMap);

      const newEvent = {
        title: `Equipo ${team.group_number} - Tutor ${getTutorNameByTutorId(
          tutor.id
        )} - Evaluador ${getTutorNameByTutorId(evaluator)}`,
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
          evaluator_id: evaluator,
          group_id: team.id,
          group_number: team.group_number,
          tutor_id: tutor.id,
        },
      };
      // Actualizar el evento si existe, o agregar uno nuevo si no existe
    setInitialEvents((prevEvents) => {
      const eventIndex = prevEvents.findIndex(
        (event) => event.result.group_id === team.id
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
    const teamDateCount = {};

    events.forEach((event) => {
      const teamId = event.result.group_id;
      teamDateCount[teamId] = (teamDateCount[teamId] || 0) + 1;
    });

    // Verificar si algún equipo tiene más de una fecha asignada
    const hasMultipleDates = Object.values(teamDateCount).some(
      (count) => count > 1
    );

    if (hasMultipleDates) {
      handleSnackbarOpen(
        "No se pueden guardar los cambios. Hay equipos con más de una fecha asignada.",
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
    setMaxTeams("");
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

  // Al confirmar la asignación manual de fecha
  const handleConfirmEvent = async () => {
    // Crea un evento (una asignación), solo la setea y cierra el dialog
    if (selectedSlot && team) {
      const teamTutor = tutors.find(
        (t) =>
          t.tutor_periods &&
          t.tutor_periods.some(
            (tp) =>
              tp.period_id === period.id && tp.id === team.tutor_period_id
          )
      );
      const color = getEvaluatorColor(evaluator, evaluatorColorMap);

      const newEvent = {
        title: `Equipo ${team.group_number} - Tutor ${getTutorNameByTutorId(
          teamTutor.id
        )} - Evaluador ${getTutorNameByTutorId(evaluator)}`,
        start: selectedSlot.start,
        end: selectedSlot.end,
        color: color,
        result: {
          date: selectedSlot.start,
          evaluator_id: evaluator,
          group_id: team.id,
          tutor_id: teamTutor.id,
        },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]); // []
      setModalOpen(false);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2}>
        {/* Descripción */}
        <Description />
        {/* Verificación Previa */}
        <DatesPreCheck inputInfo={inputInfo} setSelectedMenu={setSelectedMenu}/>

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
            // onClick={() => navigate(`/dashboard/${period.id}/teams`)}
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

      <EvaluatorDialog // El de tildar quiénes son evaluadores
        user={user}
        open={openEvaluatorDialog}
        handleClose={handleEvaluatorDialogClose}
        handleEvaluatorDialogClose={handleEvaluatorDialogClose}
      />

      <SpecificDateDialog // Asignar fecha a equipo (manualmente)
        open={assignDateOpenDialog}
        onClose={() => setAssignDateOpenDialog(false)}
        teams={teams}
        period={period}
        
        team={team}
        tutor={tutor}
        topic={topic}
        setTeam={setTeam}
        setTutor={setTutor}
        setTopic={setTopic}

        evaluator={evaluator}
        setEvaluator={setEvaluator}

        selectedDateTime={selectedDateTime}
        setSelectedDateTime={setSelectedDateTime}
        selectedHour={selectedHour}
        setSelectedHour={setSelectedHour}

        handleAssignDate={handleAssignDate}
        getTutorNameById={getTutorNameById}
        hours={hours}
        tutors={tutors}        
      />

      <ResultsDialog // Luego de correr el algoritmo
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

      <Dialog // Éste se abre: desde resultsDialog -> Editar -> clickear un slot vacío
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Asignar Fecha a Equipo</DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3}>
            {/* Selección de Equipo */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Equipo</Typography>
              <Select
                fullWidth
                displayEmpty
                value={team.group_number}
                onChange={(e) => {
                  const selectedGroup = teams.find(
                    (g) => g.group_number === e.target.value
                  );
                  setTeam(selectedGroup);

                  const selectedTutor = getTutorNameById(
                    selectedGroup.tutor_period_id,
                    period.id
                  );
                  setTutor(selectedTutor ? selectedTutor : "");
                  setTopic(selectedGroup.topic ? selectedGroup.topic.name : "[No tiene tema asignado.]");
                }}
                renderValue={(selected) => {
                  const selectedTeam = teams.find(
                    (t) => t.group_number === selected
                  );
                  return selectedTeam
                    ? `Grupo ${selectedTeam.group_number}`
                    : "Selecciona un Grupo";
                }}
              >
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.group_number}>
                    {`Grupo ${team.group_number}`}
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
                value={evaluator}
                onChange={(e) => setEvaluator(e.target.value)}
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
          Seleccione la diferencia de equipos entre evaluadores y el límite
          máximo de equipos por semana
        </DialogTitle>
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
            label="Máximo equipos por semana"
            type="number"
            fullWidth
            value={maxTeams}
            onChange={(e) => setMaxTeams(e.target.value)}
          />
        </DialogContent>
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
