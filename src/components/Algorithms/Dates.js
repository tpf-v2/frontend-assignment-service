import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { useSelector } from "react-redux";
import MySnackbar from "../UI/MySnackBar";
import dayjs from "dayjs";
import Description from "./Dates/Description";
import ButtonSection from "./Dates/ButtonSection";
import CalendarSection from "./Dates/CalendarSection";
import LoadingDialog from "./Dates/LoadingDialog";
import EvaluatorDialog from "./Dates/EvaluatorDialog";
import SpecificDateDialog from "./Dates/SpecificDateDialog";
import { assignSpecificDate } from "../../api/assignments";


const Dates = () => {
  const period = useSelector((state) => state.period);
  const user = useSelector((state) => state.user);

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
  // const [selectedTutors, setSelectedTutors] = useState([]);
  const [group, setGroup] = useState("");
  const [tutor, setTutor] = useState("");
  const [topic, setTopic] = useState("");
  const [selectedHour, setSelectedHour] = useState("");

  const [events, setEvents] = useState([]);

  // Genera las opciones de horas (ej: 9:00, 10:00, ..., 17:00)
  const hours = Array.from({ length: 13 }, (_, i) => `${9 + i}:00`);
  const [evaluador, setEvaluador] = useState("");
  const [assignDateOpenDialog, setAssignDateOpenDialog] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(dayjs());

  // useEffect(() => {
  //   await get
  // }, []);

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
    console.log("Fecha y hora asignada:", selectedDateTime);
    console.log("Hora:", selectedHour);
    console.log("Grupo", group);
    console.log("Evaluador", evaluador);

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
        t.tutor_periods.some((tp) => tp.period_id === period.id && tp.id === group.tutor_period_id)
    );
    try{
      await assignSpecificDate(user, group.id, tutor.id, evaluador, formatUpdatedDateTime(selectedDateTime, selectedHour))
      handleSnackbarOpen(
        "Fecha asignada correctamente",
        "success"
      );
    } catch {
      handleSnackbarOpen(
        "Hubo un error al asignar la fecha.",
        "error"
      );
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

  const filteredTutors = tutors.filter((tutor) =>
    tutor.tutor_periods.some(
      (tutor_period) =>
        tutor_period.period_id === period.id && tutor_period.is_evaluator
    )
  );

  const handleAssignEspecificDate = () => {
    setAssignDateOpenDialog(true);
  };

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
      </Grid>

      {/* Sección de Tabla y Botón a la derecha */}
      <Grid item xs={12}>
        <CalendarSection />
      </Grid>

      {/* Spinner de carga */}
      <LoadingDialog
        open={openDialog}
        setOpenDialog={setOpenDialog}
        loading={loading}
      />

      <EvaluatorDialog
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
        filteredTutors={filteredTutors}
        group={group}
        setGroup={setGroup}
        setTutor={setTutor}
        setTopic={setTopic}
      />

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
