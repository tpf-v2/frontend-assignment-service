import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTopics } from "../../redux/slices/topicsSlice";
import { setTutors } from "../../redux/slices/tutorsSlice";
import { getTableData } from "../../api/handleTableData";
import { getDashboardData } from "../../api/dashboardStats";
import { Container, Box, Grid, Paper } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import ContentPdfProjects from "../../components/UI/Dashboards/AdminStats/Components/ContentAnteproyecto";
import { setGroups } from "../../redux/slices/groupsSlice";
import { downloadProject, getProjects } from "../../api/handleProjects";
import { setStudents } from "../../redux/slices/studentsSlice";

// Estilos
const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#ffffff",
  boxShadow: theme.shadows[3],
}));

const PublicPDFView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.period);
  const tutors = useSelector((state) => state.tutors);
  const students = useSelector((state) => state.students);
  const topics = useSelector((state) => state.topics);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAnteproyectos, setLoadingAnteproyectos] = useState(true);
  const [loadingFinalProjects, setLoadingFinalProjects] = useState(true);

  const [selectedMenu, setSelectedMenu] = useState("Inicio");
  const [deliveries, setDeliveries] = useState(null);
  const [showUploadCSV, setShowUploadCSV] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getDashboardData(period.id, user);
        dispatch(setTopics(data.topics));
        dispatch(setTutors(data.tutors));
        dispatch(setStudents(data.students));
        setDashboardData(data);

        const endpoint = `/groups/?period=${period.id}`;
        const groupsData = await getTableData(endpoint, user);
        dispatch(setGroups(groupsData));
      } catch (error) {
        console.error("Error al obtener datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [])

useEffect(() => {
  const start = async (menu) => {
    setSelectedMenu(menu);
    setShowUploadCSV(false);
    setLoadingFinalProjects(true);
    const finalProjectsData = await getProjects(
      user,
      period.id,
      'final'
    );
    if (finalProjectsData) {
      setDeliveries(finalProjectsData);
    } else {
      console.error("No se encontraron datos de entregas finales");
    }
    setLoadingFinalProjects(false);
  };
  start()
  }, []);

  const downloadFinalFile = async (groupId, groupNumber) => {
    try {
      await downloadProject(groupId, user, period.id, "final", groupNumber);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
  };

  const renderContent = () => {
    return (
      <ContentPdfProjects
        loadingProjects={loadingFinalProjects}
        deliveries={deliveries}
        downloadFile={downloadFinalFile}
        projectType={"final"}
      />
    );
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        width: "95%", // Ajusta el ancho al 90% del viewport
        height: "120vh", // Ocupa el 100% de la altura de la pantalla
        maxWidth: "none", // Para que el maxWidth no limite el tamaño
      }}
    >
      <Root>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={3}>
            <Sidebar
              selectedMenu={selectedMenu}
              handleNavigation={null}
              period={period.id}
            />
          </Grid>
          {/* Contenido */}
          <Grid item xs={9}>
            <Box mt={2}>{renderContent()}</Box>
          </Grid>
        </Grid>
      </Root>
    </Container>
  );
};

export default PublicPDFView;