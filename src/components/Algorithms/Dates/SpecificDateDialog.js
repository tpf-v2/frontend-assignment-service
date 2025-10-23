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
import { getTutorNameById } from "../../../utils/getEntitiesUtils";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { esES } from "@mui/x-date-pickers/locales";
import updateLocale from "dayjs/plugin/updateLocale";
import minMax from "dayjs/plugin/minMax";
// Ajustes, para DatePicker
dayjs.locale("es"); // para mostrar texto en español
// para que la semana siga iniciando en domingo (y no en lunes)
dayjs.extend(updateLocale);
dayjs.updateLocale("es",{
  weekStart: 0
});
dayjs.extend(minMax); // para poder comparar ("min")

const SpecificDateDialog = ({
  open,
  onClose,

  item,
  setItem,

  initialDate,
  
  period,
  teams,
  tutors,

  handleAssignDate,
  showLastPart=false,
  dialogTitle="Agregar", // "Agregar" o "Editar"
}) => {
  const [isAssignDisabled, setIsAssignDisabled] = useState(true);
  
  // Genera las opciones de horas (ej: 9:00, 10:00, ..., 17:00)
  const hours = Array.from({ length: 13 }, (_, i) => `${9 + i}:00`);

  const filteredTutors = tutors?.filter((tutor) =>
    tutor.tutor_periods.some(
      (tutor_period) =>
        tutor_period.period_id === period.id && tutor_period.is_evaluator
    )
  );

  // Esto + name: para llamar a una sola y no necesitar un set para cada campo
  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  // Verifica si todos los campos necesarios están completos para habilitar el botón de Asignar
  useEffect(() => {
    setIsAssignDisabled(
      showLastPart ?
      !(
        item?.team &&
        item?.selectedDateTime &&
        item?.selectedHour &&
        item?.evaluator
      )
      :
      !(
        item?.team &&
        item?.evaluator
      ) 
    );
  }, [item?.team, item?.selectedDateTime, item?.selectedHour, item?.evaluator]);

  const handleClose = () => {
    // Restablece los valores de todos los campos
    setItem({})   
    onClose(); // Cierra el diálogo
  };

  console.log("--- Recibo item:", item);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{dialogTitle} Asignación de Fecha a Equipo</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Selección de Equipo */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Selecciona un Equipo:
            </Typography>
            <Select
              fullWidth
              value={item?.team?.group_number || ""}
              onChange={(e) => {
                const selectedTeam = teams?.find(
                  (t) => t.group_number === e.target.value
                );

                const selectedTutor = getTutorNameById(
                  selectedTeam.tutor_period_id,
                  period.id,
                  tutors
                );
                setItem({ ...item,
                  team: selectedTeam,
                  tutor: selectedTutor ? selectedTutor : "",
                  topic: selectedTeam.topic ? selectedTeam.topic.name : "[No tiene tema asignado.]"
                });
              }}
              displayEmpty
              renderValue={(selected) => {
                const selectedTeam = teams?.find((t) => t.group_number === selected);
                return selectedTeam ? `Equipo ${selectedTeam.group_number}` : "Selecciona un equipo";
              }}
            >
              <MenuItem value="" disabled>
                Selecciona un equipo
              </MenuItem>
              {teams?.map((team) => (
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
              value={item?.tutor || ""}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
              margin="dense"
              disabled
            />
          </Grid>          
          <Grid item xs={12}>
            <TextField
              label="Tema"
              value={item?.topic || ""}
              fullWidth
              InputProps={{ readOnly: true }}
              variant="outlined"
              margin="dense"
              disabled
            />
          </Grid>

          {/* Selección de Evaluador */}
          <Grid item xs={12} md={12}>
            <Typography variant="subtitle1" gutterBottom>
              Selecciona un Evaluador:
            </Typography>
            <Select
              fullWidth              
              name="evaluator"
              value={item?.evaluator || ""}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Selecciona un evaluador
              </MenuItem>
              {filteredTutors?.map((tutor) => (
                <MenuItem key={tutor.id} value={tutor.id}>
                  {`${tutor.name} ${tutor.last_name}`}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          {showLastPart && (
            <>
              <Grid item xs={6}>
                <LocalizationProvider // Parámetros "es", para que mes y días de la semana estén en español
                  dateAdapter={AdapterDayjs}
                  adapterLocale="es"
                  localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
                >
                  <DatePicker
                    label="Fecha"                    
                    value={item?.selectedDateTime ? dayjs(item.selectedDateTime) : null}
                    onChange={(newValue) => setItem({...item, selectedDateTime: newValue.startOf("day")})}
                    format="DD/MM/YYYY"
                    minDate={initialDate ? dayjs.min(dayjs(initialDate), dayjs()) : dayjs()} // Desde qué fecha permite seleccionar
                    defaultCalendarMonth={initialDate ? dayjs.min(dayjs(initialDate), dayjs()) : dayjs()}
                    shouldDisableDate={(date) => {
                      const day = date.day();
                      return day === 0 || day === 6; // No permitir seleccionar fines de semana
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <Select
                  name="selectedHour"
                  value={item?.selectedHour || ""}
                  onChange={handleChange}
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
          onClick={() =>
            handleAssignDate(
            item?.team, item?.evaluator,
            item?.selectedDateTime, item?.selectedHour,
            handleClose)
          }
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
