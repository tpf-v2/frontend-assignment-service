import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  List,
  ListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import { getMyGroups } from "../../api/getMyGroups";
import LearningPath from "../../components/LearningPath";
import Inicio from "../../components/UI/Dashboards/Tutor/Inicio";
import GroupReview from "../../components/UI/Dashboards/Tutor/GroupReview";
import AvailabilityCalendar from "../../components/WIP/AvailabilityCalendar";
import MySnackbar from "../../components/UI/MySnackBar";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import EventModal from "../../components/EventModal";

// Estilos
const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#ffffff",
  boxShadow: theme.shadows[3],
}));

const SidebarContainer = styled(Box)(({ theme }) => ({
  paddingRight: theme.spacing(3),
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const SidebarList = styled(List)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const ListItemStyled = styled(ListItem)(({ selected }) => ({
  backgroundColor: selected ? "#005B9A" : "transparent",
  color: "#000000",
  "&:hover": {
    backgroundColor: selected ? "#005B9A" : "#D6E4F0",
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: "#0072C6",
  textAlign: "center",
  fontSize: "2rem",
  fontWeight: "bold",
  flexGrow: 1,
}));

const TutorDashboardView = () => {
  const { cuatrimestre } = useParams();
  const user = useSelector((state) => state.user);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("Inicio");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [events, setEvents] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState("info");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({ start: null, end: null });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    const getGroups = async () => {
      try {
        const groups = await getMyGroups(user, cuatrimestre);
        setUserGroups(groups.sort((a, b) => a.id - b.id));
      } catch (error) {
        console.error("Error when getting my groups: ", error);
      }
    };
    getGroups();
    setLoading(false);
  }, [loading]);

  const handleSnackbarOpen = (message, status = "info") => {
    setSnackbarMessage(message);
    setSnackbarStatus(status);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
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

    // Abrir el modal
    setSelectedSlot({ start, end });
    setModalOpen(true);
  };

  const handleConfirmEvent = () => {
    setEvents((prevEvents) => [
      ...prevEvents,
      {
        start: selectedSlot.start,
        end: selectedSlot.end
      },
    ]);
    handleSnackbarOpen(
      "Bloque de disponibilidad creado exitosamente.",
      "success"
    );
    setModalOpen(false);
  };

  const handleSelectEvent = (event) => {
    setEventToDelete(event); // Guarda el evento a eliminar
    setConfirmDeleteOpen(true); // Abre el modal de confirmación
  };

  const handleDeleteEvent = () => {
    if (eventToDelete) {
      setEvents((prevEvents) => 
        prevEvents.filter(event => event.start !== eventToDelete.start || event.end !== eventToDelete.end)
      );
      handleSnackbarOpen("Bloque de disponibilidad eliminado exitosamente.", "success");
    }
    setConfirmDeleteOpen(false); // Cierra el modal
  };

  const contentMap = {
    Inicio: <Inicio />,
    "Mis Grupos": <div>Contenido del Formulario de Fechas</div>,
    "Seleccionar Disponibilidad": (
      <AvailabilityCalendar
        events={events}
        handleSelectSlot={handleSelectSlot}
        handleSelectEvent={handleSelectEvent} // Agregar el manejo para seleccionar eventos
      />
    ),
    "Fechas de presentaciones": (
      <div>Contenido para Fechas de Presentación</div>
    ),
    Revisiones: selectedGroup ? (
      <GroupReview
        groupId={selectedGroup}
        pdfUrl={`path/to/your/pdf/group-${selectedGroup}.pdf`} // Reemplaza con la URL correcta de tu PDF
      />
    ) : null,
  };

  const renderContent = () => {
    return contentMap[selectedMenu] ? (
      contentMap[selectedMenu]
    ) : (
      <LearningPath
        group_id={selectedGroup}
        group={userGroups.find((group) => group.id === selectedGroup)}
      />
    );
  };

  return (
    <Container maxWidth={false} sx={{ maxWidth: "1350px" }}>
      <Root>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={3}>
            <SidebarContainer>
              <Title variant="h4">{cuatrimestre}</Title>
              <SidebarList>
                <ListItemStyled
                  button
                  selected={selectedMenu === "Inicio"}
                  onClick={() => setSelectedMenu("Inicio")}
                >
                  Inicio
                </ListItemStyled>
                <Divider />
                {/* Asignaciones - Mis Grupos */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Mis Grupos
                  </AccordionSummary>
                  <AccordionDetails>
                    {userGroups.map((group) => (
                      <ListItemStyled
                        key={group.id}
                        button
                        selected={selectedMenu === `Grupo ${group.id}`}
                        onClick={() => {
                          setSelectedGroup(group.id);
                          setSelectedMenu(`Grupo ${group.id}`);
                        }}
                      >
                        Grupo {group.id}
                      </ListItemStyled>
                    ))}
                  </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Mis Presentaciones
                  </AccordionSummary>
                  <AccordionDetails>
                    <ListItemStyled
                      button
                      selected={selectedMenu === "Seleccionar Disponibilidad"}
                      onClick={() =>
                        setSelectedMenu("Seleccionar Disponibilidad")
                      }
                    >
                      Seleccionar Disponibilidad
                    </ListItemStyled>
                    <ListItemStyled
                      button
                      selected={selectedMenu === "Fechas de presentación"}
                      onClick={() => setSelectedMenu("Fechas de presentación")}
                    >
                      Fechas de Presentaciones
                    </ListItemStyled>
                  </AccordionDetails>
                </Accordion>
              </SidebarList>
            </SidebarContainer>
          </Grid>
          {/* Contenido principal */}
          <Grid item xs={9}>
            {renderContent()}
          </Grid>
        </Grid>

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
      </Root>
    </Container>
  );
};

export default TutorDashboardView;