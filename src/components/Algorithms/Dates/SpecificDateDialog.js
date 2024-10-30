// AssignDateDialog.js
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const SpecificDateDialog = ({
  open,
  onClose,
  groups,
  period,
  tutor,
  topic,
  evaluador,
  setEvaluador,
  selectedDateTime,
  setSelectedDateTime,
  selectedHour,
  setSelectedHour,
  handleAssignDate,
  getTutorNameById,
  hours,
  filteredTutors,
  group,
  setGroup,
  setTutor,
  setTopic,
  handleSnackBarOpen
}) => {
  const handleHourChange = (event) => {
    setSelectedHour(event.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
                );
                setTutor(selectedTutor ? selectedTutor : "");
                setTopic(selectedGroup.topic.name);
              }}
              renderValue={(selected) => {
                const selectedGroup = groups.find((g) => g.id === selected);
                return selectedGroup ? `Grupo ${selectedGroup.id}` : "";
              }}
            >
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {`Grupo ${group.id}`}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Tutor"
              value={tutor}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Tema"
              value={topic}
              fullWidth
              InputProps={{ readOnly: true }}
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
                label="Selecciona la Fecha"
                value={selectedDateTime}
                onChange={(newValue) => {
                  // Ajustar la fecha seleccionada a medianoche en la zona horaria local
                  const adjustedDate = newValue.startOf("day");
                  setSelectedDateTime(adjustedDate);
                }}
                format="DD/MM/YYYY"
                minDate={dayjs()}
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
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleAssignDate} color="primary">
          Asignar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SpecificDateDialog;
