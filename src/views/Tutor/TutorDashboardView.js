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
import AvailabilityCalendar from "../../components/AvailabilityCalendar";
import DatePicker from "react-datepicker"; // Importa el DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Estilos por defecto
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

const TutorDashboardView = () => {
  const { cuatrimestre } = useParams();
  const user = useSelector((state) => state.user);
  const [userGroups, setUserGroups] = useState([]);
  const [userGroupsToReview, setUserGroupsToReview] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("Inicio");
  const [selectedGroup, setSelectedGroup] = useState(null); // Campo para el grupo seleccionado
  const [selectedGroupReview, setSelectedGroupReview] = useState(null); // Campo para la revisión seleccionada

  const [availability, setAvailability] = useState([]); // Estado para bloques de disponibilidad

  useEffect(() => {
    const getGroups = async () => {
      try {
        const groups = await getMyGroups(user, cuatrimestre);
        setUserGroups(groups.sort((a, b) => a.id - b.id));
      } catch (error) {
        console.error("Error al obtener los grupos: ", error);
      }
    };
    //TODO: traer grupos a revisar por el tutor

    const getGroupsToReview = async () => {
      try {
        const groups = await getMyGroupsToReview(user, cuatrimestre);
        setUserGroupsToReview(groups.sort((a, b) => a.id - b.id));
      } catch (error) {
        console.error("Error al obtener los grupos: ", error);
      }
    };

    getGroupsToReview();
    getGroups();
    setLoading(false);
  }, [loading]);

  const contentMap = {
    Inicio: <Inicio />,
    "Mis Grupos": <div>Contenido del Formulario de Fechas</div>,
    "Seleccionar Disponibilidad": <AvailabilityCalendar />,
    "Fechas de presentación": <div>Contenido para Fechas de Presentación</div>,
    Revisiones: selectedGroupReview ? (
      <GroupReview groupId={selectedGroupReview} />
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
<Container maxWidth={false} 
    sx={{ 
      width: "95%", // Ajusta el ancho al 90% del viewport
      height: "120vh", // Ocupa el 100% de la altura de la pantalla
      maxWidth: "none", // Para que el maxWidth no limite el tamaño
    }}>      <Root>
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
                    Revisiones
                  </AccordionSummary>
                  <AccordionDetails>
                    {userGroupsToReview.map((group) => (
                      <ListItemStyled
                        key={group.id}
                        button
                        selected={
                          selectedGroupReview === group.id &&
                          selectedMenu === "Revisiones"
                        }
                        onClick={() => {
                          setSelectedGroupReview(group.id);
                          setSelectedMenu("Revisiones");
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
      </Root>
    </Container>
  );
};

export default TutorDashboardView;
