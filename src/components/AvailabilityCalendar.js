import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Typography, Button } from "@mui/material";
import MySnackbar from "./UI/MySnackBar";
import EventModal from "./EventModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { sendAvailability, fetchAvailability, putAvailability } from "../api/handleAvailability";
import { CalendarStyled, AvailabilityContainer, ButtonContainer, DescriptionBox } from "../styles/AvailabilityCalendarStyle";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPeriodAvailability } from "../api/getPeriodAvailability";
import { useDispatch } from "react-redux";
import { transformSlotsToIntervals } from "../utils/TransformSlotsToIntervals";


// Localizador de momento
const localizer = momentLocalizer(moment);

const AvailabilityCalendar = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState("info");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [availabilitySent, setAvailabilitySent] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.period);
  const navigate = useNavigate();
  const [availableDates, setPeriodAvailability] = useState(new Set());
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    const periodAvailability = async () => {
      if (!user) {
        console.error("El usuario no está definido.");
        setLoading(false);
        return;
      }
  
      try {
        console.log(period)
        const availability = await getPeriodAvailability(user,period);
        const availabilitySet = new Set(availability.map(item => {
          // Asegurarse de que el item tenga la propiedad slot
          if (item.slot) {
            return moment(item.slot).toISOString();
          } else {
            console.error("El elemento no contiene la propiedad 'slot':", item);
            return null; // Puede tomar decisiones sobre slots no válidos aquí
          }
        }).filter(Boolean)); // Filtrar valores nulos
  
        const initialAvailability = async () => {
          try {
            const slots = await fetchAvailability(user, period.id);
            const formattedSlots = transformSlotsToIntervals(slots);
            setEvents(formattedSlots)
            if (slots.length > 0) {
              setAvailabilitySent(true)
            }
          } catch (error) {
            console.error("Error when fetching dates")
          }
        };
        initialAvailability();
        setPeriodAvailability(availabilitySet); // Establecer el conjunto de disponibilidad
        console.log(availabilitySet)
      } catch (error) {
        console.error("Error al obtener la disponibilidad", error);
      } finally {
        setLoading(false); // Finalizar la carga de datos
      }
    };
  
    periodAvailability();
  }, [dispatch, user,loading]);

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
  
    if (!availableDates.has(startIsoString)) {
      handleSnackbarOpen("Esta hora no está disponible para selección.", "error");
      return;
    }
  
    const isEventOverlap = events.some(
      (event) => start < event.end && end > event.start
    );
  
    if (isEventOverlap) {
      handleSnackbarOpen("El evento se solapa con otro existente. Por favor, selecciona un intervalo diferente.", "error");
      return;
    }
  
    setSelectedSlot({ start, end });
    setModalOpen(true);
  };

  const handleConfirmEvent = () => {
    if (selectedSlot) {
      setEvents((prevEvents) => [
        ...prevEvents,
        { start: selectedSlot.start, end: selectedSlot.end },
      ]);
      handleSnackbarOpen(
        "Bloque de disponibilidad creado exitosamente.",
        "success"
      );
      setModalOpen(false);
    }
  };

  const handleSelectEvent = (event) => {
    setEventToDelete(event);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteEvent = () => {
    if (eventToDelete) {
      setEvents((prevEvents) =>
        prevEvents.filter(
          (event) =>
            event.start !== eventToDelete.start ||
            event.end !== eventToDelete.end
        )
      );
      handleSnackbarOpen(
        "Bloque de disponibilidad eliminado exitosamente.",
        "success"
      );
    }
    setConfirmDeleteOpen(false);
  };

  const onSubmitEvents = async () => {
    try {
      const gmt3Events = events.map((event) => ({
        start: moment(event.start).subtract(3, "hours").toISOString(), // Ajusto restando 3 horas
        end: moment(event.end).subtract(3, "hours").toISOString(), // Ajusto restando 3 horas
      }));

      await sendAvailability(user, period, gmt3Events);
      handleSnackbarOpen("Disponibilidad enviada exitosamente.", "success");
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      handleSnackbarOpen("Error al enviar la disponibilidad.", "error");
    }
  };

  const slotPropGetter = (date) => {
    const isoString = date.toISOString();
    
    if (!availableDates.has(isoString)) {
      return {
        style: {
          backgroundColor: "#f0f0f0", // Gray background for disabled slots
          pointerEvents: "none", // Disable interaction
        },
      };
    }
    return {};
  };

  const onEditEvents = async () => {
    try {
      const formattedEvents = events.map((event) => ({
        // Resta 3 horas (180 minutos) a cada fecha
        start: moment(event.start).subtract(3, "hours").utc().format(),
        end: moment(event.end).subtract(3, "hours").utc().format(),
      }));
      await putAvailability(user, formattedEvents, period.id);
      handleSnackbarOpen("Disponibilidad editada exitosamente.", "success");
    } catch (error) {
      handleSnackbarOpen("Error al enviar la disponibilidad.", "error");
    }
  };

  return (
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
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        views={["week"]}
        defaultView="week"
        timeslots={1}
        step={60}
        showMultiDayTimes
        defaultDate={new Date()}
        style={{ height: "500px", margin: "50px" }}
        min={new Date(0, 0, 0, 9, 0, 0)} // Comienza a las 9 AM
        max={new Date(0, 0, 0, 21, 0, 0)} // Termina a las 9 PM
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
          const hour = date.getHours();
          if (hour >= 13 && hour < 15) {
            return { style: { display: "#f0f0f0" } }; // Gray background for 13:00 to 15:00
          }
          return {};
        }}
        slotPropGetter={slotPropGetter} // Apply slot styles here
        onNavigation={(date) => {
          const day = date.getDay();
          if (day === 0 || day === 6) {
            return false;
          }
        }}
      />
      { !availabilitySent ? (
          <ButtonContainer>
              <Button variant="contained" color="primary" onClick={onSubmitEvents}>
                  Enviar
              </Button>
          </ButtonContainer>
      ) : (
        <ButtonContainer>
              <Button variant="contained" color="primary" onClick={onEditEvents}>
                  Editar
              </Button>
          </ButtonContainer>
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

export default AvailabilityCalendar;