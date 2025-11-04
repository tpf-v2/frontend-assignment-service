import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import { TitleSimple } from "../../../../styles/Titles";
import { TopPaddedContainer } from "../../../Root";

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 300,
  boxShadow: theme.shadows[2],
  padding: "20px",
  margin: "20px 0",
  backgroundColor: "#fff", // Fondo blanco
}));

const EventList = styled(List)(({ theme }) => ({
  padding: 0,
}));

const TimeContainer = styled("div")({
  alignItems: "center", // Alinear verticalmente
  display: "flex",
  marginLeft: "10px", // Empujar a la derecha
});

const EventItem = styled(ListItem)(({ theme, isUpcoming }) => ({
  padding: isUpcoming ? "30px 15px" : "15px 15px", // Aumentar padding para el evento próximo
  position: "relative",
  backgroundColor: isUpcoming ? "#e0f7fa" : "transparent", // Resaltado para el evento próximo
  borderRadius: isUpcoming ? "8px" : "0", // Bordes redondeados solo para el evento próximo
}));

const EventInfo = styled("div")({
  display: "flex",
  alignItems: "center",
});

const TimeRemaining = styled(Typography)(({ theme }) => ({
  marginLeft: "auto",
  fontWeight: "bold",
  color: theme.palette.primary.main,
  textAlign: "center", // Alinear texto a la derecha
  display: "grid",
}));

const AttendanceBox = styled(Box)(({ theme, attendanceType }) => ({
  marginLeft: "10px",
  padding: "2px 8px",
  borderRadius: "4px",
  backgroundColor: attendanceType === "Tutor" ? "#d1e7dd" : "#fff3cd", // Color de fondo amarillo para evaluador
  color: attendanceType === "Tutor" ? "#0f5132" : "#856404", // Ajuste de color para texto evaluador
  fontWeight: "bold",
  width: "230px",
  textAlign: "left",
}));

const TutorEvents = ({ events, loading }) => {
  const findUpcomingEvent = (events) => {
    const now = new Date();
    return events.reduce((nextEvent, currentEvent) => {
      const currentDate = new Date(currentEvent.date);
      return currentDate > now &&
        (!nextEvent || currentDate < new Date(nextEvent.date))
        ? currentEvent
        : nextEvent;
    }, null);
  };

  const upcomingEvent = findUpcomingEvent(events);

  return (
    <>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <TopPaddedContainer>
            <TitleSimple variant="h4" align="center" gutterBottom>
              Presentaciones
            </TitleSimple>
            <EventList>
              {events.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No hay eventos programados." />
                </ListItem>
              ) : (
                events.map((event) => (
                  <EventItem
                    key={event.id}
                    isUpcoming={upcomingEvent && upcomingEvent.id === event.id}
                  >
                    <EventInfo style={{ marginRight: "10px" }}>
                      {" "}
                      {/* Espacio adicional */}
                      <EventIcon
                        color="primary"
                        style={{ marginRight: "8px" }}
                      />{" "}
                      {/* Espacio entre el icono y el título */}
                      <ListItemText
                        primary={`Equipo ${event.id} - ${event.topic}`}
                      />
                    </EventInfo>
                    <TimeRemaining>
                      <TimeContainer>
                        <AccessTimeIcon
                          fontSize="small"
                          style={{ marginRight: "10px" }}
                        />
                        {new Date(event.date).toLocaleDateString()}{" "}
                        {new Date(event.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TimeContainer>
                      <AttendanceBox attendanceType={event.attendanceType}>
                        Asistiendo como {event.attendanceType}
                      </AttendanceBox>
                    </TimeRemaining>
                  </EventItem>
                ))
              )}
            </EventList>
          </TopPaddedContainer>
        )}
   </>
  );
};

export default TutorEvents;
