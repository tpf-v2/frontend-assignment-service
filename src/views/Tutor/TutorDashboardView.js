import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
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
import AvailabilityCalendar from "../../components/AvailabilityCalendar";
import "react-datepicker/dist/react-datepicker.css"; // Estilos por defecto
import { getMyGroupsToReview } from "../../api/getMyGroupsToReview";
import TutorEvents from "../../components/UI/Dashboards/Tutor/TutorEvents";
import { getTutorEvents } from "../../api/getTutorEvents";

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

// Loader de puntos animados
const DotsLoader = styled("div")({
  display: "inline-block",
  position: "relative",
  width: "60px",
  height: "10px",
  "& div": {
    position: "absolute",
    top: "0",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#0072C6",
    animationTimingFunction: "cubic-bezier(0, 1, 1, 0)",
  },
  "& div:nth-of-type(1)": {
    left: "8px",
    animation: "dots1 0.6s infinite",
  },
  "& div:nth-of-type(2)": {
    left: "24px",
    animation: "dots2 0.6s infinite",
  },
  "& div:nth-of-type(3)": {
    left: "40px",
    animation: "dots2 0.6s infinite",
  },
  "& div:nth-of-type(4)": {
    left: "56px",
    animation: "dots3 0.6s infinite",
  },
  "@keyframes dots1": {
    "0%": {
      transform: "scale(0)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
  "@keyframes dots3": {
    "0%": {
      transform: "scale(1)",
    },
    "100%": {
      transform: "scale(0)",
    },
  },
  "@keyframes dots2": {
    "0%": {
      transform: "translate(0, 0)",
    },
    "100%": {
      transform: "translate(16px, 0)",
    },
  },
});

const TutorDashboardView = () => {

  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.period);

  const [userTeams, setUserTeams] = useState([]);
  const [userTeamsToReview, setUserTeamsToReview] = useState([]);

  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [selectedMenu, setSelectedMenu] = useState("Inicio");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedTeamReview, setSelectedTeamReview] = useState(null);
  const [events, setEvents] = useState([]);
  
  const [loadingEvents, setLoadingEvents] = useState(false)
  
const transformEventData = (data) => {
  const tutorEvents = data.tutor_dates.map(event => ({
    id: event.group_number,
    topic: event.topic,
    date: event.slot,
    attendanceType: 'Tutor'
  }));
  
  const evaluatorEvents = data.evaluator_dates.map(event => ({
    id: event.group_number,
    topic: event.topic,
    date: event.slot,
    attendanceType: 'Evaluador'
  }));
  
  return [...tutorEvents, ...evaluatorEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
};

  useEffect(() => {
    const getTeams = async () => {
      setLoadingTeams(true);
      try {
        const teams = await getMyGroups(user, period.id);
        setUserTeams(teams.sort((a, b) => a.id - b.id));
      } catch (error) {
        console.error("Error when getting my teams: ", error);
      } finally {
        setLoadingTeams(false);
      }
    };

    const getTeamsToReview = async () => {
      setLoadingReviews(true);

      try {
        const teams = await getMyGroupsToReview(user, period.id);
        setUserTeamsToReview(teams.sort((a, b) => a.id - b.id));
      } catch (error) {
        console.error("Error al obtener los equipos: ", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    const getEvents = async () => {
      setLoadingEvents(true)
      const events = await getTutorEvents(user,period);
      const formattedEvents = transformEventData(events);
      setEvents(formattedEvents); 
      setLoadingEvents(false)
    }

    getTeams();
    getTeamsToReview();
    getEvents();
  }, [user]);

  const renderTeams = () => {
    if (loadingTeams) {
      return (
        <DotsLoader>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </DotsLoader>
      );
    }

    if (userTeams.length === 0) {
      return <Typography>No hay equipos.</Typography>;
    }

    return userTeams.map((team) => (
      <ListItemStyled
        key={team.id}
        button
        selected={selectedMenu === `Grupo ${team.group_number}`}
        onClick={() => {
          setSelectedTeam(team.id);
          setSelectedMenu(`Grupo ${team.group_number}`);
        }}
      >
        Equipo {team.group_number}
      </ListItemStyled>
    ));
  };

  const renderTeamsToReview = () => {
    if (loadingReviews) {
      return (
        <DotsLoader>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </DotsLoader>
      );
    }

    if (userTeamsToReview.length === 0) {
      return <Typography>No hay equipos.</Typography>;
    }

    return userTeamsToReview.map((team) => (
      <ListItemStyled
        key={team.id}
        button
        selected={
          selectedTeamReview?.id === team.id && selectedMenu === "Revisiones"
        }
        onClick={() => {
          setSelectedTeamReview(team);
          setSelectedMenu("Revisiones");
        }}
      >
        Equipo {team.group_number}
      </ListItemStyled>
    ));
  };
  // const events = [
  //   { id: 0, topic: 'Evento que ya paso', date: '2024-08-01T10:00:00', attendanceType: 'Tutor' },
  //   { id: 1, topic: 'Inteligencia Artificial', date: '2024-12-01T10:00:00', attendanceType: 'Tutor' },
  //   { id: 2, topic: 'Machine Learning', date: '2024-12-02T11:00:00', attendanceType: 'Evaluador' },
  //   { id: 3, topic: 'Desarrollo Web', date: '2024-12-03T14:00:00', attendanceType: 'Evaluador' },
  //   { id: 4, topic: 'Ciberseguridad', date: '2024-12-05T09:30:00', attendanceType: 'Tutor' },
  //   { id: 5, topic: 'Desarrollo Móvil', date: '2024-12-07T15:00:00', attendanceType: 'Evaluador' },
  // ];

  const contentMap = {
    Inicio: <Inicio />,
    "Mis Equipos": <div>Contenido del Formulario de Fechas</div>,
    "Seleccionar Disponibilidad": <AvailabilityCalendar />,
    "Fechas de presentación": <TutorEvents events={events} loading={loadingEvents}></TutorEvents>,
    Revisiones: selectedTeamReview ? (
      <GroupReview group={selectedTeamReview} />
    ) : (
      <div>Selecciona un equipo para ver las revisiones</div>
    ),
  };

  const renderContent = () => {
    return contentMap[selectedMenu] ? (
      contentMap[selectedMenu]
    ) : (
      <LearningPath
        team_id={selectedTeam}
        team={userTeams.find((team) => team.id === selectedTeam)}
      />
    );
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        width: "95%",
        height: "120vh",
        maxWidth: "none",
      }}
    >
      <Root>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={3}>
            <SidebarContainer>
              <Title variant="h4">{period.id}</Title>
              <SidebarList>
                <ListItemStyled
                  button
                  selected={selectedMenu === "Inicio"}
                  onClick={() => setSelectedMenu("Inicio")}
                >
                  Inicio
                </ListItemStyled>
                <Divider />
                {/* Asignaciones - Mis Equipos */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Mis Equipos
                  </AccordionSummary>
                  <AccordionDetails>{renderTeams()}</AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Revisiones
                  </AccordionSummary>
                  <AccordionDetails>{renderTeamsToReview()}</AccordionDetails>
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
      </Root>
    </Container>
  );
};

export default TutorDashboardView;