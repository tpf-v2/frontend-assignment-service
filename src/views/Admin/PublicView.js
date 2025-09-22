import { useEffect, useState } from "react";
import { styled } from "@mui/system";
import {getTutorsData} from "../../api/dashboardStats"
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTableData } from "../../api/handleTableData";
import { Container, Box, Grid, Paper } from "@mui/material";
import { downloadProject, getPublicProjects } from "../../api/handleProjects";
import ContentPublicPdfProjects from "../../components/UI/Dashboards/AdminStats/Components/ContentPublicProjectPDFs";

// Redux
import { setGroups } from "../../redux/slices/groupsSlice";
import { setTutors } from "../../redux/slices/tutorsSlice";

// Estilos
const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#ffffff",
  boxShadow: theme.shadows[3],
}));

const PublicPDFView = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const tutors = useSelector((state) => state.tutors);
  const [period, setPeriod] = useState(useParams().period);
  const [loadingFinalProjects, setLoadingFinalProjects] = useState(true);
  const [deliveries, setDeliveries] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getTutorsData(period, user);
        dispatch(setTutors(data.tutors));

        const endpoint = `/groups/?period=${period}`;
        const groupsData = await getTableData(endpoint, user);
        dispatch(setGroups(groupsData));
      } catch (error) {
        console.error("Error al obtener datos del dashboard:", error);
      } 
    };
    getData();
  }, [])

useEffect(() => {
  const start = async () => {
    setLoadingFinalProjects(true);
    const finalProjectsData = await getPublicProjects(
      user,
      period,
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
      await downloadProject(groupId, user, period, "final", groupNumber);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
  };

  const renderContent = () => {
    return (
      <ContentPublicPdfProjects
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