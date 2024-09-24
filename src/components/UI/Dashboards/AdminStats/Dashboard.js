import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StatCard from "./Components/StatCard"; // Import StatCard Component
import BarChartComponent from "./Components/BarChart";
import { setTopics } from "../../../../redux/topicsSlice";
import { setTutors } from "../../../../redux/tutorsSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Icono para el desplegable
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
import { getTableData } from "../../../../api/handleTableData";
import { setGroups } from "../../../../redux/groupsSlice";

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

const Dashboard = () => {
  const navigate = useNavigate();
  const { cuatrimestre } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("General"); // Default selected menu
  const [groups, setGroups] = useState(null);
  const user = useSelector((state) => state.user);

  const [deliveries, setDeliveries] = useState({
    anteproyecto: {
      entregados: 0,
      faltantes: 0,
      lista: [
        {
          grupo: "Grupo 1",
          archivo: "archivo1.pdf",
          fechaEntrega: "2024-09-23",
        },
        {
          grupo: "Grupo 2",
          archivo: "archivo2.pdf",
          fechaEntrega: "2024-09-23",
        },
        "Archivo 3",
      ],
    },
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

      const endpoint = `/groups/?period=${cuatrimestre}`;
      const groups = await getTableData(endpoint, user);
      dispatch(setGroups(groups)); //Guardo los topics en Redux
      setGroups(groups);
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
        return (
          <>
            <Box display="flex" justifyContent="space-between" width="100%">
              <ButtonStyled
                onClick={() => navigate(`/dashboard/${cuatrimestre}/students`)}
              >
                VER LISTA ALUMNOS
              </ButtonStyled>
              <ButtonStyled
                onClick={() => navigate(`/dashboard/${cuatrimestre}/tutors`)}
              >
                VER LISTA TUTORES
              </ButtonStyled>
            </Box>

            <Box display="flex" justifyContent="space-between" width="100%">
              <ButtonStyled
                onClick={() => navigate(`/dashboard/${cuatrimestre}/topics`)}
              >
                VER LISTA TEMAS
              </ButtonStyled>
              <ButtonStyled
                onClick={() => navigate(`/dashboard/${cuatrimestre}/groups`)}
              >
                VER GRUPOS
              </ButtonStyled>
            </Box>
            <CuatrimestreConfig />
          </>
        );
      case "Inscripciones":
        return (
          <>
            {/* Botones de carga */}

            <Box
              mt={2}
              display="flex"
              justifyContent="space-between"
              width="100%"
            >
              <ButtonStyled>CARGAR ARCHIVO DE ALUMNOS</ButtonStyled>
              <ButtonStyled>CARGAR ARCHIVO DE TUTORES</ButtonStyled>
              <ButtonStyled>CARGAR ARCHIVO DE TEMAS</ButtonStyled>
            </Box>
            <ButtonStyled
              onClick={() =>
                navigate(`/dashboard/${cuatrimestre}/form-answers`)
              }
            >
              VER RESPUESTAS
            </ButtonStyled>
            <Box mt={4}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <StatCard
                    title="Total de Alumnos"
                    value={loading ? -1 : dashboardData.studentCard}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StatCard
                    title="Total de Tutores"
                    value={loading ? -1 : dashboardData.tutorsCard}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StatCard
                    title="Total de Temas"
                    value={loading ? -1 : dashboardData.topicsCard}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box mt={4}>
              {!loading && (
                <BarChartComponent data={dashboardData.answersChart} />
              )}
            </Box>
          </>
        );
      case "Anteproyecto":
        return (
          <div>
            <Box mt={4}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <StatCard
                    title="Grupos que entregaron"
                    value={loading ? -1 : deliveries.anteproyecto.entregados}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StatCard
                    title="Grupos que faltan entregar"
                    value={loading ? -1 : deliveries.anteproyecto.faltantes}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StatCard
                    title="Total de grupos"
                    value={loading ? -1 : groups.length}
                  />
                </Grid>
              </Grid>
            </Box>

            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Grupo</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Archivo</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Fecha de Entrega
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Descargar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deliveries.anteproyecto.lista.map((entrega, index) => (
                    <TableRow key={index}>
                      <TableCell>{entrega.grupo}</TableCell>
                      <TableCell>{entrega.archivo}</TableCell>
                      <TableCell>{entrega.fechaEntrega}</TableCell>
                      <TableCell>
                        <IconButton
                          href={entrega.linkDescarga} // link para la descarga del archivo
                          target="_blank" // Abre el archivo en una nueva pestaña
                          rel="noopener noreferrer"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </TableCell>{" "}
                      {/* Botón de descarga */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        );

      case "Intermedia":
        return (
          <div>
            <Typography variant="h6">Entrega Intermedia</Typography>
            <Typography variant="body1">
              Grupos que entregaron: {deliveries.intermedia.entregados}
            </Typography>
            <Typography variant="body1">
              Grupos que faltan entregar: {deliveries.intermedia.faltantes}
            </Typography>
            <List>
              {deliveries.intermedia.lista.map((entrega, index) => (
                <ListItem key={index}>{entrega}</ListItem>
              ))}
            </List>
          </div>
        );

      case "Final":
        return (
          <div>
            <Typography variant="h6">Entrega Final</Typography>
            <Typography variant="body1">
              Grupos que entregaron: {deliveries.final.entregados}
            </Typography>
            <Typography variant="body1">
              Grupos que faltan entregar: {deliveries.final.faltantes}
            </Typography>
            <List>
              {deliveries.final.lista.map((entrega, index) => (
                <ListItem key={index}>{entrega}</ListItem>
              ))}
            </List>
          </div>
        );

      case "Fechas de presentación":
        return <div>Contenido del Formulario de Fechas</div>;
      case "Algoritmos":
        return <Algorithms user={user} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth={false} sx={{ maxWidth: "1350px" }}>
      {" "}
      <Root>
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
                    Asignaciones
                  </AccordionSummary>
                  <AccordionDetails>
                    <ListItemStyled
                      button
                      selected={selectedMenu === "Inscripciones"}
                      onClick={() => handleNavigation("Inscripciones")}
                    >
                      Inscripciones
                    </ListItemStyled>
                    <ListItemStyled
                      button
                      selected={selectedMenu === "Fechas de presentación"}
                      onClick={() => handleNavigation("Fechas de presentación")}
                    >
                      Fechas
                    </ListItemStyled>
                    <ListItemStyled
                      button
                      selected={selectedMenu === "Algoritmos"}
                      onClick={() => handleNavigation("Algoritmos")}
                    >
                      Algoritmos
                    </ListItemStyled>
                  </AccordionDetails>
                </Accordion>
                {/* Entregas - Desplegable */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Entregas
                  </AccordionSummary>
                  <AccordionDetails>
                    <ListItemStyled
                      button
                      selected={selectedMenu === "Anteproyecto"}
                      onClick={() => handleNavigation("Anteproyecto")}
                    >
                      Anteproyecto
                    </ListItemStyled>
                    <ListItemStyled
                      button
                      selected={selectedMenu === "Intermedia"}
                      onClick={() => handleNavigation("Intermedia")}
                    >
                      Intermedia
                    </ListItemStyled>
                    <ListItemStyled
                      button
                      selected={selectedMenu === "Final"}
                      onClick={() => handleNavigation("Final")}
                    >
                      Final
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

export default Dashboard;
