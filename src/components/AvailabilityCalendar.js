import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { styled } from "@mui/material/styles";
import { Box, Typography, Button } from "@mui/material";
import MySnackbar from "./UI/MySnackBar";
import EventModal from "./EventModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { sendAvailability } from "../api/sendAvailability";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPeriodAvailability } from "../api/getPeriodAvailability";
import { useDispatch } from "react-redux";

// Localizador de momento
const localizer = momentLocalizer(moment);

// Estilos personalizados para el calendario
const CalendarStyled = styled(Calendar)(({ theme }) => ({
  borderRadius: "8px",
  overflow: "hidden",
  backgroundColor: "white",
  boxShadow: theme.shadows[5],
  "& .rbc-header": {
    backgroundColor: "#0072C6", // Fondo de cabecera
    color: "white",
    fontWeight: "bold",
    textAlign: "center", // Centrar el texto
  },
  "& .rbc-event": {
    backgroundColor: "#005B9A",
    color: "#ffffff",
    borderRadius: "5px",
  },
  "& .rbc-selected": {
    backgroundColor: "#0072C6",
    color: "#ffffff",
  },
  "& .rbc-off-range-bg": {
    backgroundColor: "#f1f1f1", // Color del fondo fuera de rango
  },
  "& .rbc-day-slot": {
    border: "1px solid #d9d9d9", // Bordes en la cuadrícula
  },
  "& .rbc-toolbar": {
    display: "flex",
    justifyContent: "center", // Centrar contenidos de toolbar
    padding: "16px", // Espaciado entre el borde y los botones
    backgroundColor: "#E1F3F8", // Color de fondo claro para la barra de herramientas
    paddingRight: "120px",
  },
  "& .rbc-toolbar button": {
    backgroundColor: "#0072C6", // Color de fondo de los botones
    color: "white", // Color del texto
    border: "none", // Sin bordes
    borderRadius: "4px", // Bordes redondeados
    padding: "8px 12px", // Espaciado interno
    margin: "0 2px", // Espaciado entre botones
    cursor: "pointer", // Cambiar el cursor al pasar sobre el botón
    transition: "background-color 0.3s",
  },
  "& .rbc-toolbar button:hover": {
    backgroundColor: "#88B7E0", // Color de fondo al pasar el cursor
  },
}));

const AvailabilityContainer = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(5),
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginRight: theme.spacing(6),
}));

const DescriptionBox = styled(Box)(({ theme }) => ({
  width: "100%", // Hacer que tenga el mismo ancho que el calendario
  maxWidth: "800px", // Ajustar el ancho máximo si es necesario
  margin: "0 auto", // Centrar el contenido
  paddingTop: theme.spacing(3),
}));

const AvailabilityCalendar = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState("info");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
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
  
        setPeriodAvailability(availabilitySet); // Establecer el conjunto de disponibilidad
        console.log(availabilitySet)
      } catch (error) {
        console.error("Error al obtener la disponibilidad", error);
      } finally {
        setLoading(false); // Finalizar la carga de datos
      }
    };
  
    periodAvailability();
  }, [dispatch, user]);

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
    const endIsoString = end.toISOString();

    console.log("available dates are:", availableDates)
    console.log("start date is", startIsoString)
    console.log("end date is", endIsoString)
  
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
      <ButtonContainer>
        <Button variant="contained" color="primary" onClick={onSubmitEvents}>
          Enviar
        </Button>
      </ButtonContainer>

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
