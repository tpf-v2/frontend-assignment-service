import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTopics } from "../../redux/slices/topicsSlice";
import { setTutors } from "../../redux/slices/tutorsSlice";
import { getTableData } from "../../api/handleTableData";
import { getAnteproyectos } from "../../api/getAnteproyectos";
import { downloadAnteproyecto } from "../../api/downloadAnteproyecto";
import { getDashboardData } from "../../api/dashboardStats";
import {
  Container,
  Box,
  Grid,
  Paper
} from "@mui/material";
import Sidebar from "../../components/Sidebar";
import ContentInicio from "../../components/UI/Dashboards/AdminStats/Components/ContentInicio";
import ContentInscripciones from "../../components/UI/Dashboards/AdminStats/Components/ContentInscripciones";
import ContentAnteproyecto from "../../components/UI/Dashboards/AdminStats/Components/ContentAnteproyecto";
import { setGroups } from "../../redux/slices/groupsSlice";
import IncompleteGroups from "../../components/Algorithms/IncompleteGroups";
import TopicTutor from "../../components/Algorithms/TopicTutor";
import AvailabilityCalendar from "../../components/AvailabilityCalendar";

// Estilos
const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#ffffff",
  boxShadow: theme.shadows[3],
}));

const DashboardView = () => {
  const navigate = useNavigate();
  const { cuatrimestre } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.period);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAnteproyectos, setLoadingAnteproyectos] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("General");
  const [groupsData, setGroupsData] = useState(null);
  const [deliveries, setDeliveries] = useState(null);
  const [showUploadCSV, setShowUploadCSV] = useState(false);
  const [uploadType, setUploadType] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getDashboardData(cuatrimestre, user);
        dispatch(setTopics(data.topics));
        dispatch(setTutors(data.tutors));
        setDashboardData(data);

        const endpoint = `/groups/?period=${cuatrimestre}`;
        const groupsData = await getTableData(endpoint, user);
        console.log(groupsData)
        dispatch(setGroups(groupsData));
        setGroupsData(groupsData);
      } catch (error) {
        console.error("Error al obtener datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleNavigation = async (menu) => {
    setSelectedMenu(menu);
    setShowUploadCSV(false);
    if (menu === "Anteproyecto") {
      setLoadingAnteproyectos(true);
      const anteproyectosData = await getAnteproyectos(user, period);
      if (anteproyectosData) {
        setDeliveries(anteproyectosData);
      } else {
        console.error("No se encontraron datos de anteproyectos");
      }
      setLoadingAnteproyectos(false);
    }
  };

  const downloadFile = async (groupId) => {
    try {
      await downloadAnteproyecto(groupId, user, period.id);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "Inicio":
        return (
          <ContentInicio navigate={navigate} cuatrimestre={cuatrimestre} />
        );
      case "Inscripciones":
        return (
          <ContentInscripciones
            showUploadCSV={showUploadCSV}
            setShowUploadCSV={setShowUploadCSV}
            uploadType={uploadType}
            setUploadType={setUploadType}
            dashboardData={dashboardData}
            loading={loading}
            cuatrimestre={cuatrimestre}
          />
        );
      case "Anteproyecto":
        return (
          <ContentAnteproyecto
            loadingAnteproyectos={loadingAnteproyectos}
            deliveries={deliveries}
            groups={groupsData}
            downloadFile={downloadFile}
          />
        );
      case "Grupos":
        // return <Algorithms user={user} />;
        return <IncompleteGroups/>;
      case "Temas - Tutores - Grupos":
        return <TopicTutor/>;
      case "Intermedia":
        return <div>Contenido de entrega Intermedia</div>;
      case "Final":
        return <div>Contenido de entrega Final</div>;
      case "Fechas de presentación":
        return <AvailabilityCalendar />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth={false} 
    sx={{ 
      width: "100%", // Ajusta el ancho al 90% del viewport
      height: "120vh", // Ocupa el 100% de la altura de la pantalla
      maxWidth: "none", // Para que el maxWidth no limite el tamaño
    }}>
      <Root>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={3}>
            <Sidebar
              selectedMenu={selectedMenu}
              handleNavigation={handleNavigation}
              cuatrimestre={cuatrimestre}
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

export default DashboardView;
