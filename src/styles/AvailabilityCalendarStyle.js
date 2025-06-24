import { styled } from "@mui/material/styles";
import { Calendar } from "react-big-calendar";
import { Box } from "@mui/material";

// Estilos personalizados para el calendario
export const CalendarStyled = styled(Calendar)(({ theme }) => ({
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
    paddingRight: "120px"
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

export const AvailabilityContainer = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(5),
}));

export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginRight: theme.spacing(6),
}));

export const DescriptionBox = styled(Box)(({ theme }) => ({
  width: "100%", // Hacer que tenga el mismo ancho que el calendario
  maxWidth: "800px", // Ajustar el ancho máximo si es necesario
  margin: "0 auto", // Centrar el contenido
  paddingTop: theme.spacing(3),
}));