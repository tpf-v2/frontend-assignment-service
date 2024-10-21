import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getMyGroupsToReview } from "../../api/getMyGroupsToReview";

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

const AvailabilityContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "8px",
  backgroundColor: "#f1f1f1",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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

const TutorDashboard = () => {
  const { cuatrimestre } = useParams();

  const user = useSelector((state) => state.user);

  const [userGroups, setUserGroups] = useState([]);
  const [userGroupsToReview, setUserGroupsToReview] = useState([]);

  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [selectedMenu, setSelectedMenu] = useState("Inicio");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupReview, setSelectedGroupReview] = useState(null);

  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    const getGroups = async () => {
      setLoadingGroups(true);
      try {
        const groups = await getMyGroups(user, cuatrimestre);
        setUserGroups(groups.sort((a, b) => a.id - b.id));
      } catch (error) {
        console.error("Error al obtener los grupos: ", error);
      } finally {
        setLoadingGroups(false);
      }
    };

    const getGroupsToReview = async () => {
      setLoadingReviews(true);
      try {
        const groups = await getMyGroupsToReview(user, cuatrimestre);
        setUserGroupsToReview(groups.sort((a, b) => a.id - b.id));
      } catch (error) {
        console.error("Error al obtener los grupos de revisión: ", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    getGroups();
    getGroupsToReview();
  }, [user, cuatrimestre]);

  const handleDateChange = (date) => {
    if (date) {
      setAvailability((prev) => [...prev, date]);
    }
  };

  const renderGroups = () => {
    if (loadingGroups) {
      return (
        <DotsLoader>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </DotsLoader>
      );
    }

    if (userGroups.length === 0) {
      return <Typography>No hay grupos.</Typography>;
    }

    return userGroups.map((group) => (
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
    ));
  };

  const renderGroupsToReview = () => {
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

    if (userGroupsToReview.length === 0) {
      return <Typography>No hay grupos.</Typography>;
    }

    return userGroupsToReview.map((group) => (
      <ListItemStyled
        key={group.id}
        button
        selected={
          selectedGroupReview?.id === group.id && selectedMenu === "Revisiones"
        }
        onClick={() => {
          setSelectedGroupReview(group);
          setSelectedMenu("Revisiones");
        }}
      >
        Grupo {group.id}
      </ListItemStyled>
    ));
  };

  const contentMap = {
    Inicio: <Inicio />,
    "Mis Grupos": <div>Contenido del Formulario de Fechas</div>,
    "Seleccionar Disponibilidad": (
      <AvailabilityContainer>
        <Typography variant="h6" gutterBottom>
          Selecciona tu Disponibilidad
        </Typography>
        <DatePicker
          selected={null}
          onChange={handleDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={30}
          dateFormat="MMMM d, yyyy h:mm aa"
          inline
        />
        <Box>
          {availability.length > 0 && (
            <Typography variant="body1">
              Bloques seleccionados:{" "}
              {availability.map((date, index) => (
                <div key={index}>{date.toString()}</div>
              ))}
            </Typography>
          )}
        </Box>
      </AvailabilityContainer>
    ),
    "Fechas de presentación": <div>Contenido para Fechas de Presentación</div>,
    Revisiones: selectedGroupReview ? (
      <GroupReview group={selectedGroupReview} />
    ) : (
      <div>Selecciona un grupo para ver las revisiones</div>
    ),
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
                  <AccordionDetails>{renderGroups()}</AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Revisiones
                  </AccordionSummary>
                  <AccordionDetails>{renderGroupsToReview()}</AccordionDetails>
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

export default TutorDashboard;
