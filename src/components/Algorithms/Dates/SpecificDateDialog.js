import React, { useEffect, useState } from "react";
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
import { getTutorNameById } from "../../../utils/getEntitiesUtils"

const SpecificDateDialog = ({
  open,
  onClose,
  period,  
  teams,

  team,
  setTeam,
  tutor,
  setTutor,
  topic,
  setTopic,
  evaluator,
  setEvaluator,
  selectedDateTime,
  setSelectedDateTime,
  selectedHour,
  setSelectedHour,

  handleAssignDate,  
  hours,
  
  tutors,
  showLastPart=false,

  item,
  setItem,
  
}) => {
  const [isAssignDisabled, setIsAssignDisabled] = useState(true);
  const filteredTutors = tutors.filter((tutor) =>
    tutor.tutor_periods.some(
      (tutor_period) =>
        tutor_period.period_id === period.id && tutor_period.is_evaluator
    )
  );

  // Esto + label: para llamar a una sola y no necesitar un set para cada campo
  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  // Verifica si todos los campos necesarios están completos para habilitar el botón de Asignar
  useEffect(() => {
    setIsAssignDisabled(
      showLastPart ?
      !(
        team &&
        selectedDateTime &&
        selectedHour &&
        evaluator
      )
      :
      !(
        team &&
        evaluator
      ) 
    );
  }, [team, selectedDateTime, selectedHour, evaluator]);

  const handleHourChange = (event) => {
    setSelectedHour(event.target.value);
  };

  const handleClose = () => {
    // Restablece los valores de todos los campos
    setTeam("");
    setTutor("");
    setTopic("");
    setEvaluator("");
    if (setSelectedDateTime) {
      setSelectedDateTime(null);
    }
    if (setSelectedHour) {
      setSelectedHour("");
    }
    onClose(); // Cierra el diálogo
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Asignar Fecha a Equipo</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Selección de Equipo */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Selecciona un Equipo:
            </Typography>
            <Select
              fullWidth
              value={team?.group_number || ""}
              onChange={(e) => {
                const selectedTeam = teams.find(
                  (t) => t.group_number === e.target.value
                );
                setTeam(selectedTeam);

                const selectedTutor = getTutorNameById(
                  selectedTeam.tutor_period_id,
                  period.id,
                  tutors
                );
                setTutor(selectedTutor ? selectedTutor : "");
                setTopic(selectedTeam.topic ? selectedTeam.topic.name : "[No tiene tema asignado.]");
              }}
              displayEmpty
              renderValue={(selected) => {
                const selectedTeam = teams.find((t) => t.group_number === selected);
                return selectedTeam ? `Equipo ${selectedTeam.group_number}` : "Selecciona un equipo";
              }}
            >
              <MenuItem value="" disabled>
                Selecciona un equipo
              </MenuItem>
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.group_number}>
                  {`Equipo ${team.group_number}`}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Tutor y Tema */}
          <Grid item xs={12} md={12}>
            <TextField
              label="Tutor"
              value={tutor || ""}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
              margin="dense"
            />
          </Grid>          
          <Grid item xs={12}>
            <TextField
              label="Tema"
              value={topic || ""}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
              margin="dense"
            />
          </Grid>

          {/* Selección de Evaluador */}
          <Grid item xs={12} md={12}>
            <Typography variant="subtitle1" gutterBottom>
              Selecciona un Evaluador:
            </Typography>
            <Select
              fullWidth
              value={evaluator || ""}
              onChange={(e) => setEvaluator(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Selecciona un evaluador
              </MenuItem>
              {filteredTutors.map((tutor) => (
                <MenuItem key={tutor.id} value={tutor.id}>
                  {`${tutor.name} ${tutor.last_name}`}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          {showLastPart && (
            <>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Fecha"
                    value={selectedDateTime}
                    onChange={(newValue) => setSelectedDateTime(newValue.startOf("day"))}
                    format="DD/MM/YYYY"
                    minDate={dayjs()}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <Select
                  value={selectedHour || ""}
                  onChange={handleHourChange}
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="" disabled>
                    Selecciona la Hora
                  </MenuItem>
                  {hours?.map((hour) => (
                    <MenuItem key={hour} value={hour}>
                      {hour}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error" variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={() => handleAssignDate(handleClose)}
          color="primary"
          variant="contained"
          disabled={isAssignDisabled}
        >
          Asignar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SpecificDateDialog;
