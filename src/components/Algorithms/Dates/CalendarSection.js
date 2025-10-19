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

const CalendarSection = ({ events, defaultDate, loadingDates, teams, tutors, period }) => {
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

  // Aux: En construcción!!!
  const makeEditableItem = (event) => {
    // 282024 no anda el tutor, revisar [], lo demás pasado anda :), y ver cómo pasar la fecha.
    const editableItem = {
      team: {group_number: event.result?.group_number}, // []
      topic: teams?.find(
         (t) => t.group_number === event.result.group_number
         )?.topic.name, // "hermoso" -_-, esto es lo que hace el Specific xq no tenemos el team. Mandarlo a util al menos []
      tutor: getTutorNameById(
         event.result.tutor_id, // cuidado, no me acuerdo si es lo mismo, decía tutor_period_id, revisar (sí, el dato que veo suena a eso, x más que se llame tutor_id)
         period.id,
         tutors
       ),
      evaluator: event.result.evaluator_id,
      selectedDateTime: "",//event.start // Ver cómo usar la event.date que tiene toda esta info
      selectedHour: "",
    }
    return editableItem;
  }

  console.log("---selectedEvent:", selectedEvent); //aux: esta cosa no tiene el formato que espera Specific...
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
                        <Button // Aux: probando
                          //onClick={() => {setSelectedEvent(selectedEvent.result); setEditDateOpenDialog(true)}}
                          onClick={() => {
                            console.log("--- selectedEvent aux:", selectedEvent); // cosas
                            const constructedItem = makeEditableItem(selectedEvent);
                            setSelectedEvent(constructedItem);
                            console.log("--- constructedItem:", constructedItem); // undefined, y el sgte selectedEvent undefined entonces
                            setEditDateOpenDialog(true)}
                          }
                          style={{ backgroundColor: "#e0711d", color: "white" }} //botón naranja
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

          {/* Probando */}
          <SpecificDateDialog // Asignar fecha a equipo manualmente, al clickear Editar en el slot ampliado
            open={editDateOpenDialog}
            onClose={() => setEditDateOpenDialog(false)}        
            item={selectedEvent}
            setItem={setSelectedEvent}

            teams={teams}
            tutors={tutors}
            period={period}

            //hours={hours}
            showLastPart={true}
            //handleAssignDate={handleAssignDate}
          />
        </>

      )}
    </>
  );
};

export default CalendarSection;
