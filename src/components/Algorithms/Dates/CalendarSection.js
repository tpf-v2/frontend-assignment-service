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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Importar el ícono de cerrar
import 'moment/locale/es';
import { useMemo } from 'react';

const localizer = momentLocalizer(moment);

const CalendarSection = ({ events, defaultDate, loadingDates }) => {
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
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
              <Dialog open={open} onClose={handleClose}>
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
                      <Typography variant="body1">
                        {`Horario: ${moment(selectedEvent.start).format(
                          "HH:mm"
                        )} - ${moment(selectedEvent.end).format("HH:mm")}`}
                      </Typography>
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
        </>
      )}
    </>
  );
};

export default CalendarSection;
