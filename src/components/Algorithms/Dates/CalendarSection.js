import React, { useState } from "react";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { CalendarStyled } from "../../../styles/AvailabilityCalendarStyle";
import { Box } from "@mui/system";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Importar el ícono de cerrar
import 'moment/locale/es';
import { useMemo } from 'react';
import SpecificDateDialog from "./SpecificDateDialog";
import { getTutorNameById } from "../../../utils/getEntitiesUtils"

moment.tz.setDefault('America/Argentina/Buenos Aires')
const localizer = momentLocalizer(moment);

const CalendarSection = ({ events, defaultDate, loadingDates, teams, tutors, period, handleAssignDate }) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // "item"
  const [editDateOpenDialog, setEditDateOpenDialog] = useState(false); // aux: nuevo, probando

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setOpenDetails(true);
  };

  const handleClose = () => {
    setOpenDetails(false);
    setSelectedEvent(null);
    console.log("seteando a null"); // aux
  };
  const { formats } = useMemo(() => ({
    formats: {
      dayFormat: (date, culture, localizer) =>
        localizer.format(date,  'dddd DD/MM', culture),

      dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
        localizer.format(start,  'dddd D, YYYY', culture) +
        ' - ' +
        localizer.format(end,  'dddd D, YYYY', culture),
    },
  }))

  // Transformar el formato para pasarle a SpecificDateDialog el item precargado con el formato que espera.
  const makeEditableItem = (event) => {
    // To-Do: refactor para evitar toda esta vuelta:
    //  - tendría que ser "tutor = getTutorNameById(event.result.tutor_id,..." pero no anda, xq es otro dato.
    //  - el team debe tener id (debo buscarlo como acá entonces) xq afuera usa el team.id para obtener el team y con eso
    //    hacer tutor=getTutorById(team.tutor_period_id) y obtener el "tutor_id":
    //    que sí, el tutor_id es exactamente lo que tengo acá ahora. No lo puedo usar directamente y me obliga a dar toda la vuelta,
    //    porque así funciona el add que también usa el mismo SpecificDateDialog.
    const team = teams?.find( // <-- workaround
      (t) => t.group_number === event.result?.group_number
    );
    const editableItem = {
      team: team,
      topic: team?.topic.name,
      tutor: getTutorNameById(team?.tutor_period_id, period.id, tutors), // <-- workaround
      evaluator: event.result?.evaluator_id,
      selectedDateTime: event.start || null,
      selectedHour: `${event.start?.getHours()}:00` || null, //${event.start.getMinutes()}`, esto obtne '0', y las opciones son siempre en punto, nunca y media etc
    }
    return editableItem;
  }

  console.log("---selectedEvent:", selectedEvent);
  return (
    <>
      {loadingDates ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {events ? (
            <>
              <CalendarStyled
                messages = {{next: "Siguiente",previous: "Atrás",today: "Hoy"}}
                localizer={localizer}
                events={events}
                selectable
                onSelectEvent={handleEventSelect}
                views={["week"]}
                formats={formats}
                defaultView="week"
                timeslots={1}
                step={60}
                showMultiDayTimes
                defaultDate={defaultDate || new Date()}
                culture={"es"}
                style={{
                  height: "90vh",
                  margin: "20px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                }}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: event.color,
                    color: "black",
                    fontSize: "0.85rem",
                    borderRadius: "4px",
                    padding: "4px",
                  },
                })}
                min={new Date(0, 0, 0, 9, 0, 0)}
                max={new Date(0, 0, 0, 21, 0, 0)}
                components={{
                  month: {
                    header: () => null,
                  },
                }}
                dayPropGetter={(date) => {
                  const day = date.getDay();
                  if (day === 0 || day === 6) {
                    return { style: { display: "none" } }; // Ocultar este día
                  }
                  return {};
                }}
              />

              {/* Dialog para mostrar la información del evento */}
              <Dialog open={openDetails} onClose={handleClose}>
                <DialogTitle>
                  Detalles del Evento
                  <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                    style={{ position: "absolute", right: "8px", top: "8px" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  {selectedEvent && (
                    <Paper
                      style={{
                        padding: "16px",
                        backgroundColor: selectedEvent.color,
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        {selectedEvent.title}
                      </Typography>
                      <Box sx={{display: "flex"}}>
                        <Typography variant="body1">
                          {`Horario: ${moment(selectedEvent.start).format(
                            "HH:mm"
                          )} - ${moment(selectedEvent.end).format("HH:mm")}`}
                        </Typography>
                        <Button
                          onClick={() => {
                            const constructedItem = makeEditableItem(selectedEvent);
                            setSelectedEvent(constructedItem);
                            setEditDateOpenDialog(true);
                            // Cerramos este modal de details, pero sin flushear los datos xq los necesitamos para editar
                            setOpenDetails(false);
                          }}
                          style={{ backgroundColor: "#e0711d", color: "white" }} //botón naranja // Aux: pienso cambiar la estética []
                          sx={{ml: "auto"}}>
                          Editar
                        </Button>
                      </Box>
                    </Paper>
                  )}
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="300px"
            >
              <CircularProgress />
            </Box>
          )}

          {/* Editar, luego de confirmados los resultados del algoritmo */}
          <SpecificDateDialog // Asignar fecha a equipo manualmente, al clickear Editar en el slot ampliado
            open={editDateOpenDialog}
            onClose={() => setEditDateOpenDialog(false)}        
            item={selectedEvent}
            setItem={setSelectedEvent}

            teams={teams}
            tutors={tutors}
            period={period}

            showLastPart={true}
            handleAssignDate={handleAssignDate}
            dialogTitle="Editar"
          />
        </>

      )}
    </>
  );
};

export default CalendarSection;
