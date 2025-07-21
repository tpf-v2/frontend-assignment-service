import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CircularProgress, Typography } from "@mui/material";
import MySnackbar from "./UI/MySnackBar";
import EventModal from "./EventModal";
import { CalendarInterval } from "./CalendarInterval"
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import {
  fetchAvailability,
  fetchStudentAvailability,
  sendStudentAvailability,
  putStudentAvailability,
  fetchTutorAvailability,
  sendTutorAvailability,
  putTutorAvailability,
} from "../api/handleAvailability";
import {
  CalendarStyled,
  AvailabilityContainer,
  DescriptionBox,
} from "../styles/AvailabilityCalendarStyle";
import { useSelector } from "react-redux";
import { transformSlotsToIntervals, fixTimezone } from "../utils/TransformSlotsToIntervals";
import ClosedAlert from "./ClosedAlert";
import { Box } from "@mui/system";
import 'moment/locale/es';
import { useMemo } from 'react';

import browser from '../services/browserDetect';
import BrowserWarning from './BrowserWarning';
// Localizador de momento
const localizer = momentLocalizer(moment);

const AvailabilityCalendar = () => {
  const [userAvailability, setUserAvailability] = useState([]); // Fechas seleccionadas por el estudiante
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState("info");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const [eventToDelete, setEventToDelete] = useState(null);
  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.period);
  const [availableDates, setAvailableDates] = useState(new Set()); // Mantener como un Set
  const [defaultDate, setDefaultDate] = useState(null); // Estado para la fecha predeterminada

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        console.error("El usuario no está definido.");
        setLoading(false);
        return;
      }
      setLoading(true)
      try {
        // Fechas disponibles para seleccionar
        const slots = await fetchAvailability(user, period.id);

        // Actualizar el Set de fechas disponibles
        const availableDatesSet = new Set(
          slots.map((item) => { return fixTimezone(item.slot); })
        );

        setAvailableDates(availableDatesSet); // Establecer el conjunto de fechas disponibles

        // Establecer defaultDate como la primera fecha de availableDates
        if (availableDatesSet.size > 0) {
          const sortedDates = Array.from(availableDatesSet).sort();
          setDefaultDate(new Date(sortedDates[0])); // Convertir a Date el primer valor
        }

        // Fechas ya seleccionadas por el estudiante
        const userAvailability = await fetchUserAvailability(user, period);
        const formattedUserAvailability =
          transformSlotsToIntervals(userAvailability);
        setUserAvailability(formattedUserAvailability);
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    const startIsoString = start.toISOString();
    
    // Crear una nueva fecha a partir de 'end' y restarle una hora solo para la verificación
    const adjustedEnd = new Date(end);
    adjustedEnd.setHours(adjustedEnd.getHours() - 1);
    const adjustedEndIsoString = adjustedEnd.toISOString(); // Usar la fecha ajustada solo para el chequeo
  
    // Verificar si el intervalo seleccionado está completamente dentro de las fechas disponibles
    const isStartAvailable = availableDates.has(startIsoString);
    const isEndAvailable = availableDates.has(adjustedEndIsoString); // Verificar con la fecha ajustada
  
    if (!isStartAvailable || !isEndAvailable) {
      handleSnackbarOpen(
        "Esta hora no está disponible para selección.",
        "error"
      );
      return;
    }

    // Verificación de solapamiento de eventos
    const isEventOverlap = userAvailability.some(
      (event) => start < event.end && end > event.start
    );
  
    if (isEventOverlap) {
      handleSnackbarOpen(
        "El evento se solapa con otro existente. Por favor, selecciona un intervalo diferente.",
        "error"
      );
      return;
    }
  
    setSelectedSlot(new CalendarInterval(start, end)); // Guardar 'end' original
    setModalOpen(true);
  };

  const handleConfirmEvent = async () => {
    if (selectedSlot) {
      const newEvent = new CalendarInterval(selectedSlot.start, selectedSlot.end); // TODO do we need a new instance?
      setUserAvailability((prevEvents) => [...prevEvents, newEvent]);
      // handleSnackbarOpen(
      //   "Bloque de disponibilidad creado exitosamente.",
      //   "success"
      // );
      setModalOpen(false);

      try {
        const formattedEvents = [
          selectedSlot.formatForSend(),
        ];

        await sendUserAvailability(user, formattedEvents, period);
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
      const updatedEvents = userAvailability.filter(
        (event) =>
          event.start.toISOString() !== eventToDelete.start.toISOString() || event.end.toISOString() !== eventToDelete.end.toISOString()
      );
  
      setConfirmDeleteOpen(false);
  
      try {
        const formattedEvents = updatedEvents.map((event) => (event.formatForSend()));
        // Envía la lista actualizada de eventos al backend
        await sendUserUpdatedEvents(user, formattedEvents, period);
  
        setUserAvailability(updatedEvents); // Actualiza el estado local
        handleSnackbarOpen(
          "Intervalo de disponibilidad eliminado exitosamente.",
          "success"
        );
      } catch (error) {
        handleSnackbarOpen("Error al actualizar la disponibilidad.", "error");
      }
    }
  };  

  const slotPropGetter = (date) => {
    const isoString = date.toISOString();
    if (!availableDates.has(isoString)) {
      // Aquí se utiliza correctamente el Set
      return {
        style: {
          backgroundColor: "#f0f0f0", // Gray background for disabled slots
          pointerEvents: "none", // Disable interaction
        },
      };
    }
    return {};
  };
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
    <>
      {!loading ? (
        period.presentation_dates_available ? (
          <AvailabilityContainer>
            <Typography variant="h4" align="center" gutterBottom>
              Selecciona tu disponibilidad
            </Typography>
            {/* Descripción del Calendario */}
            <DescriptionBox>
              <Typography variant="body1" align="justify" gutterBottom>
                En este calendario, podrás seleccionar los bloques de tiempo que estás
                disponible para presentar. Haz clic en cualquier espacio en blanco
                para agregar un bloque de disponibilidad. Si necesitas eliminar un
                bloque existente, simplemente selecciónalo de nuevo.
              </Typography>
            </DescriptionBox>
  
            <CalendarStyled
              localizer={localizer}
              events={userAvailability}
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
              min={new Date(0, 0, 0, 9, 0, 0)}
              max={new Date(0, 0, 0, 21, 0, 0)}
              formats={formats}
              components={{
                month: {
                  header: () => null,
                },
              }}
              dayPropGetter={(date) => {
                const day = date.getDay();
                if (day === 0 || day === 6) {
                  return { style: { display: "none" } };
                }
                return {};
              }}
              slotPropGetter={slotPropGetter}
              onNavigate={(date) => {
                const day = date.getDay();
                if (day === 0 || day === 6) {
                  return false;
                }
              }}
            />
  
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
        ) : (
          <ClosedAlert message="No se aceptan respuestas al formulario de fechas." />
        )
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      )}
    </>
  );
  
};

export default AvailabilityCalendar;

async function sendUserUpdatedEvents(user, formattedEvents, period) {
  if (user.role === "student") {
    await putStudentAvailability(user, formattedEvents, user.group_id, period.id);
  } else {
    await putTutorAvailability(user, formattedEvents, user.id, period.id);
  }
}

async function sendUserAvailability(user, formattedEvents, period) {
  user.role === "student" ? await sendStudentAvailability(user, formattedEvents, user.group_id, period.id) : await sendTutorAvailability(user, formattedEvents, user.id, period.id);
}

async function fetchUserAvailability(user, period) {
  return user.role === "student" ? await fetchStudentAvailability(
    user,
    user.group_id
  ) : await fetchTutorAvailability(
    user,
    user.id,
    period.id
  );
}
