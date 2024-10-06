// AvailabilityCalendar.js
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

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

const DescriptionBox = styled(Box)(({ theme }) => ({
  width: '100%', // Hacer que tenga el mismo ancho que el calendario
  maxWidth: '800px', // Ajustar el ancho máximo si es necesario
  margin: '0 auto', // Centrar el contenido
  paddingTop: theme.spacing(3)
}));

const AvailabilityCalendar = ({
  events,
  handleSelectSlot,
  handleSelectEvent,
}) => {
  return (
    <AvailabilityContainer>
      <Typography variant="h4" align="center" gutterBottom>
        Selecciona tu disponibilidad
      </Typography>

      {/* Descripción del Calendario */}
      <DescriptionBox>
        <Typography variant="body1" align="justify" gutterBottom>
          En este calendario, podrás seleccionar los bloques de tiempo que 
          estás disponible para presentar. Haz clic en cualquier espacio 
          en blanco para agregar un bloque de disponibilidad. 
          Si necesitas eliminar un bloque existente, simplemente selecciónalo de nuevo.
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
          return {};
        }}
        onNavigation={(date) => {
          const day = date.getDay();
          if (day === 0 || day === 6) {
            return false;
          }
        }}
      />
    </AvailabilityContainer>
  );
};

export default AvailabilityCalendar;