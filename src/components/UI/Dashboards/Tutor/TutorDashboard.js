// TutorDashboard.jsx

import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  TextField,
  Button
} from "@mui/material";
import { setTopics } from "../../../../redux/topicsSlice";
import { setTutors } from "../../../../redux/tutorsSlice";
import { getDashboardData } from "../../../../api/dashboardStats";
import { getMyGroups } from "../../../../api/getMyGroups";
import TutorGroupLearningPath from "./dashboardContent/TutorGroupLearningPath";
import General from "./dashboardContent/General";
import GroupReview from "./dashboardContent/GroupReview";
import DatePicker from "react-datepicker"; // Importa el DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Estilos por defecto

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

const ListItemStyled = styled(ListItem)(({ theme, selected }) => ({
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

const TutorDashboard = () => {
  const { cuatrimestre } = useParams();
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("General");
  const [selectedGroup, setSelectedGroup] = useState(null); // Campo para el grupo seleccionado
  const [availability, setAvailability] = useState([]); // Estado para bloques de disponibilidad
  const user = useSelector((state) => state.user);
  const [userGroups, setUserGroups] = useState([]);

  const getGroups = async () => {
    try {
      const groups = await getMyGroups(user, cuatrimestre);
      setUserGroups(groups.sort((a, b) => a.id - b.id));
    } catch (error) {
      console.error("Error al obtener grupos:", error);
    }
  };

  useEffect(() => {
    getGroups();
  }, [loading]);

  const handleDateChange = (date) => {
    if (date) {
      setAvailability((prev) => [...prev, date]); // Agrega el bloque de disponibilidad
    }
  };

  const contentMap = {
    "General": <General />,
    "Grupos a corregir": <div>Contenido del Formulario de Fechas</div>,
    "Seleccionar disponibilidad": (
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
          inline // Esto mostrará el calendario directamente
        />
        <Box>
          {availability.length > 0 && (
            <Typography variant="body1">
              Bloques seleccionados: {availability.map((date, index) => (
                <div key={index}>{date.toString()}</div>
              ))}
            </Typography>
          )}
        </Box>
      </AvailabilityContainer>
    ),
    "Fechas de presentación": <div>Contenido para Fechas de Presentación</div>,
    "Revisiones": selectedGroup ? (
      <GroupReview 
        groupId={selectedGroup} 
        pdfUrl={`path/to/your/pdf/group-${selectedGroup}.pdf`} // Reemplaza con la URL correcta de tu PDF
      />
    ) : null,
  };

  const renderContent = () => {
    return contentMap[selectedMenu] ? contentMap[selectedMenu] : <TutorGroupLearningPath group={selectedMenu} />;
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
                <ListItemStyled button selected={selectedMenu === "General"} onClick={() => setSelectedMenu("General")}>
                  General
                </ListItemStyled>
                <Divider />
                {/* Asignaciones - Mis Grupos */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>Mis Grupos</AccordionSummary>
                  <AccordionDetails>
                    {userGroups.map((group) => (
                      <ListItemStyled key={group.id} button selected={selectedMenu === `Grupo ${group.id}`} onClick={() => {
                        setSelectedGroup(group.id);
                        setSelectedMenu(`Grupo ${group.id}`);
                      }}>
                        Grupo {group.id}
                      </ListItemStyled>
                    ))}
                  </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>Revisiones</AccordionSummary>
                  <AccordionDetails>
                    {userGroups.map((group) => (
                      <ListItemStyled key={group.id} button selected={selectedMenu === `Grupo ${group.id}`} onClick={() => {
                        setSelectedGroup(group.id);
                        setSelectedMenu(`Revisiones`);
                      }}>
                        Grupo {group.id}
                      </ListItemStyled>
                    ))}
                  </AccordionDetails>
                </Accordion>
                
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>Presentaciones</AccordionSummary>
                  <AccordionDetails>
                    <ListItemStyled button selected={selectedMenu === "Seleccionar disponibilidad"} onClick={() => setSelectedMenu("Seleccionar disponibilidad")}>
                      Seleccionar disponibilidad
                    </ListItemStyled>
                    <ListItemStyled button selected={selectedMenu === "Fechas de presentación"} onClick={() => setSelectedMenu("Fechas de presentación")}>
                      Fechas de presentación
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