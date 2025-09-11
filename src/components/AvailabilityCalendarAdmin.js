import React, { useState, useEffect } from "react";
import { momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CircularProgress, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import moment from "moment-timezone";
import 'moment/locale/es';
import MySnackbar from "./UI/MySnackBar";
import EventModal from "./EventModal"; // Asegúrate de que este import está aquí
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import {
  sendAvailability,
  fetchAvailability,
  putAvailability,
} from "../api/handleAvailability";
import {
  CalendarStyled,
  AvailabilityContainer,
  DescriptionBox,
} from "../styles/AvailabilityCalendarStyle";
import { transformSlotsToIntervals } from "../utils/TransformSlotsToIntervals";
import { Box } from "@mui/system";
import { useMemo } from 'react';

import browser from '../services/browserDetect';
import BrowserWarning from './BrowserWarning';
import { CalendarInterval } from "./CalendarInterval";

// Localizador de momento
moment.tz.setDefault('America/Argentina/Buenos Aires')
const localizer = momentLocalizer(moment);

const AvailabilityCalendarAdmin = () => {
  const [events, setEvents] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState("info");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [availabilitySent, setAvailabilitySent] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // Estado para el EventModal
  const [selectedSlot, setSelectedSlot] = useState(null); // Estado para el slot seleccionado
  const [defaultDate, setDefaultDate] = useState(null); // Estado para la fecha predeterminada
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.period);

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

  const handleSelectSlot = ({ start, end }) => {
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
    setSelectedSlot(new CalendarInterval(start, end));
    setModalOpen(true); // Abrir el modal para confirmar
  };

  const handleConfirmEvent = async () => {
    if (selectedSlot) {
      const newEvent = new CalendarInterval(selectedSlot.start, selectedSlot.end);
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      setModalOpen(false); // Cerrar el modal después de confirmar

      try {
        const formattedEvents = [
          newEvent.formatForSend(),
        ];

        await sendAvailability(user, formattedEvents, period.id);
        setAvailabilitySent(true);
        handleSnackbarOpen("Disponibilidad enviada exitosamente.", "success");
      } catch (error) {
        handleSnackbarOpen("Error al enviar la disponibilidad.", "error");
      }
    }
  };

  const handleSelectEvent = (event) => {
    setEventToDelete(event);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteEvent = async () => {
    if (eventToDelete) {
      const updatedEvents = events.filter(
        (event) =>
          event.start.toISOString() !== eventToDelete.start.toISOString() || event.end.toISOString() !== eventToDelete.end.toISOString()
      );
      setConfirmDeleteOpen(false); // Cerrar el modal de confirmación

      try {
        const formattedEvents = updatedEvents.map((event) => {
          const interval = new CalendarInterval(event.start, event.end)
          return interval.formatForSend()
        });

        // Envía la lista actualizada de eventos al backend
        await putAvailability(user, formattedEvents, period.id);

        setEvents(updatedEvents); // Actualiza el estado local
        handleSnackbarOpen(
          "Intervalo de disponibilidad eliminado exitosamente.",
          "success"
        );
      } catch (error) {
        handleSnackbarOpen("Error al actualizar la disponibilidad.", "error");
      }
    }
  };

  useEffect(() => {
    const initialAvailability = async () => {
      try {
        setLoading(true);
        const slots = await fetchAvailability(user, period.id);
        const formattedSlots = transformSlotsToIntervals(slots);
        setEvents(formattedSlots);
        if (slots.length > 0) {
          setAvailabilitySent(true);
        }

        // Establecer defaultDate como la primera fecha de availableDates
        if (slots.length > 0) {
          const sortedDates = Array.from(slots).sort();
          setDefaultDate(new Date(sortedDates[0].slot));
        }
      } catch (error) {
        console.error("Error when fetching dates");
      } finally {
        setLoading(false);
      }
    };
    initialAvailability();
  }, [availabilitySent]);

  const { formats } = useMemo(() => ({
    formats: {
      dayFormat: (date, culture, localizer) =>
        localizer.format(date, 'dddd DD/MM', culture),

      dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
        localizer.format(start, 'dddd D, YYYY', culture) +
        ' - ' +
        localizer.format(end, 'dddd D, YYYY', culture),
    },
  }))

  if (!browser.isDateCompatible()) {
    return <BrowserWarning />;
  }

  return (
    <AvailabilityContainer>
      <Typography variant="h4" align="center" gutterBottom>
        Selecciona tu disponibilidad
      </Typography>
      {/* Descripción del Calendario */}
      <DescriptionBox>
        <Typography variant="body1" align="justify" gutterBottom>
          En este calendario podrás seleccionar los intervalos de tiempo que
          estás disponibles para que los equipos realicen sus presentaciones. Haz
          clic en cualquier espacio en blanco para agregar un intervalo de
          disponibilidad. Si deseas crear un intervalo que dure más de 1 hora,
          simplemente arrastra el mouse desde el inicio hasta el final del
          intervalo. Si necesitas eliminar un intervalo existente, simplemente
          selecciónalo de nuevo.
        </Typography>
      </DescriptionBox>
      {!loading ? (
        <CalendarStyled
          localizer={localizer}
          events={events}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          views={["week"]}
          defaultView="week"
          timeslots={1}
          step={60}
          showMultiDayTimes
          defaultDate={defaultDate || new Date()}
          culture={"es"}
          style={{ height: "500px", margin: "50px" }}
          min={new Date(0, 0, 0, 9, 0, 0)} // Comienza a las 9 AM
          max={new Date(0, 0, 0, 21, 0, 0)} // Termina a las 9 PM
          formats={formats}
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
          messages = {{next: "Siguiente",previous: "Atrás",today: "Hoy"}}
        />
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

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmEvent}
      />

      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDeleteEvent}
      />

      <MySnackbar
        message={snackbarMessage}
        status={snackbarStatus}
        open={snackbarOpen}
        handleClose={handleSnackbarClose}
      />
    </AvailabilityContainer>
  );
};

export default AvailabilityCalendarAdmin;
