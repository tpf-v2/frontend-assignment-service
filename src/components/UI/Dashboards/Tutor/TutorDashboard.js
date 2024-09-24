import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StatCard from "../AdminStats/Components/StatCard";
import BarChartComponent from "../AdminStats/Components/BarChart";
import { setTopics } from "../../../../redux/topicsSlice";
import { setTutors } from "../../../../redux/tutorsSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";  // Icono para el desplegable
import DownloadIcon from "@mui/icons-material/Download";

import {
  Container,
  Button,
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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import { getDashboardData } from "../../../../api/dashboardStats";
import CuatrimestreConfig from "../../CuatrimestreConfig";
import Algorithms from "../../../Algorithms/Algorithms";

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

const ButtonStyled = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  width: "48%",
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  backgroundColor: "#0072C6",
  color: "#ffffff",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: "#005B9A",
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

const TutorDashboard = () => {
  const navigate = useNavigate();
  const { cuatrimestre } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("General"); // Default selected menu
  const user = useSelector((state) => state.user);

  const [deliveries, setDeliveries] = useState({
    anteproyecto: { entregados: 0, faltantes: 0, lista: [{
      grupo: "Grupo 1",
      archivo: "archivo1.pdf",
      fechaEntrega: "2024-09-23"
    }, {
      grupo: "Grupo 2",
      archivo: "archivo2.pdf",
      fechaEntrega: "2024-09-23"
    }, "Archivo 3"] },
    intermedia: { entregados: 0, faltantes: 0, lista: [] },
    final: { entregados: 0, faltantes: 0, lista: [] },
  });
  
  const handleNavigation = (menu) => {
    setSelectedMenu(menu);
  };

  const dispatch = useDispatch();

  const getData = async () => {
    try {
      const data = await getDashboardData(cuatrimestre, user);

      console.log("TOPICS", data.topics);
      dispatch(setTopics(data.topics)); //Guardo los topics en Redux
      console.log("TUTORS", data.tutors);
      dispatch(setTutors(data.tutors)); //Guardo los tutors en Redux

      setDashboardData(data);
    } catch (error) {
      console.error("Error al obtener datos del dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [loading]);

  // Función para renderizar el contenido basado en el menú seleccionado
  const renderContent = () => {
    switch (selectedMenu) {
      case "General":
        // Aquí puedes implementar el contenido específico para Grupo 1
        return <Typography variant="h6">Contenido General</Typography>;
  
      case "Grupo 1":
        // Aquí puedes implementar el contenido específico para Grupo 1
        return <Typography variant="h6">Contenido del Grupo 1</Typography>;
        
      case "Grupo 2":
        // Y así continuar para cada grupo
        return <Typography variant="h6">Contenido del Grupo 2</Typography>;
  
      case "Grupo 3":
        return <Typography variant="h6">Contenido del Grupo 3</Typography>;
  
      case "Grupo 4":
        return <Typography variant="h6">Contenido del Grupo 4</Typography>;
  
      case "Grupo 5":
        return <Typography variant="h6">Contenido del Grupo 5</Typography>;
  
      case "Grupo 6":
        return <Typography variant="h6">Contenido del Grupo 6</Typography>;
  
      case "Corrección de anteproyectos":
        return <div>Contenido del Formulario de Fechas</div>;
  
      case "Seleccionar disponibilidad":
        return <div>Contenido para Seleccionar Disponibilidad</div>;
  
      case "Fechas de presentación":
        return <div>Contenido para Fechas de Presentación</div>;
  
      default:
        return null;
    }
  };
  return (
    <Container maxWidth={false} sx={{ maxWidth: "1350px" }}>      <Root>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={3}>
            <SidebarContainer>
              <Title variant="h4">{cuatrimestre}</Title>
              <SidebarList>
                <ListItemStyled
                  button
                  selected={selectedMenu === "General"}
                  onClick={() => handleNavigation("General")}
                >
                  General
                </ListItemStyled>

                <Divider /> {/* Divider después de General */}

                {/* Asignaciones - Desplegable */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Mis Grupos
                  </AccordionSummary>
                  <AccordionDetails>
                  <ListItemStyled
                      button
                      selected={selectedMenu === "Grupo 1"}
                      onClick={() => handleNavigation("Grupo 1")}
                    >
                      Grupo 1
                    </ListItemStyled>
                    <ListItemStyled
                      button
                      selected={selectedMenu === "Grupo 2"}
                      onClick={() => handleNavigation("Grupo 2")}
                    >
                      Grupo 2
                    </ListItemStyled>
                    <ListItemStyled
                      button
                      selected={selectedMenu === "Grupo 3"}
                      onClick={() => handleNavigation("Grupo 3")}
                    >
                      Grupo 3
                    </ListItemStyled>
                  </AccordionDetails>
                </Accordion>

                {/* Asignaciones - Desplegable */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Corrección de anteproyectos
                  </AccordionSummary>
                  <AccordionDetails>
                    <ListItemStyled
                      button
                      selected={selectedMenu === "Grupo 4"}
                      onClick={() => handleNavigation("Grupo 4")}
                    >
                      Grupo 4
                    </ListItemStyled>
                    <ListItemStyled
                      button
                      selected={selectedMenu === "Grupo 5"}
                      onClick={() => handleNavigation("Grupo 5")}
                    >
                      Grupo 5
                    </ListItemStyled>
                    <ListItemStyled
                      button
                      selected={selectedMenu === "Grupo 6"}
                      onClick={() => handleNavigation("Grupo 6")}
                    >
                      Grupo 6
                    </ListItemStyled>
                  </AccordionDetails>
                </Accordion>

                {/* Entregas - Desplegable */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Presentaciones
                  </AccordionSummary>
                  <AccordionDetails>
                    <ListItemStyled
                      button
                      selected={selectedMenu === "Seleccionar disponibilidad"}
                      onClick={() => handleNavigation("Seleccionar disponibilidad")}
                    >
                      Seleccionar disponibilidad
                    </ListItemStyled>
                    <ListItemStyled
                      button
                      selected={selectedMenu === "Fechas de presentación"}
                      onClick={() => handleNavigation("Fechas de presentación")}
                    >
                      Fechas de presentación
                    </ListItemStyled>
                  </AccordionDetails>
                </Accordion>
              </SidebarList>
            </SidebarContainer>
          </Grid>

          {/* Main content */}
          <Grid item xs={9}>
            {renderContent()}
          </Grid>
        </Grid>
      </Root>
    </Container>
  );
};

export default TutorDashboard;