import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTopics } from "../../../../redux/slices/topicsSlice";
import { setTutors } from "../../../../redux/slices/tutorsSlice";
import { getTableData } from "../../../../api/handleTableData";
import { setGroups } from "../../../../redux/slices/groupsSlice";
import { getAnteproyectos } from "../../../../api/getAnteproyectos";
import { downloadAnteproyecto } from "../../../../api/downloadAnteproyecto";
import { getDashboardData } from "../../../../api/dashboardStats";
import {
  Container,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import Sidebar from "./Components/Sidebar";
import ContentGeneral from "./Components/ContentGeneral";
import ContentInscripciones from "./Components/ContentInscripciones";
import ContentAnteproyecto from "./Components/ContentAnteproyecto";
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

const Dashboard = () => {
  const navigate = useNavigate();
  const { cuatrimestre } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.period);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAnteproyectos, setLoadingAnteproyectos] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("General");
  const [groups, setGroups] = useState(null);
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
        dispatch(setGroups(groupsData));
        setGroups(groupsData);
      } catch (error) {
        console.error("Error al obtener datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [cuatrimestre, user, dispatch]);

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
      await downloadAnteproyecto(groupId, user, period);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "General":
        return (
          <ContentGeneral navigate={navigate} cuatrimestre={cuatrimestre} />
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
            groups={groups}
            downloadFile={downloadFile}
          />
        );
      case "Algoritmos":
        return <Algorithms user={user} />;
      case "Intermedia":
        return <div>Contenido de entrega Intermedia</div>;
      case "Final":
        return <div>Contenido de entrega Final</div>;
      case "Fechas de presentación":
        return <div>Contenido del Formulario de Fechas</div>;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth={false} sx={{ maxWidth: "1350px" }}>
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

export default Dashboard;
