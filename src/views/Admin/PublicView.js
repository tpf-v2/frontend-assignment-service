import { useEffect, useState } from "react";
import { styled } from "@mui/system";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Box, Grid, Paper } from "@mui/material";
import { downloadProject, getPublicProjects } from "../../api/handleProjects";
import ContentPublicPdfProjects from "../../components/UI/Dashboards/AdminStats/Components/ContentPublicProjectPDFs";

// Estilos
const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#ffffff",
  boxShadow: theme.shadows[3],
}));

const PublicPDFView = () => {
  const user = useSelector((state) => state.user);
  const _param_period = useParams().period;
  const [period, setPeriod] = useState(_param_period); // Da warning set no usado; debería ser const period = seState(_param_period);
  const [loadingFinalProjects, setLoadingFinalProjects] = useState(true);
  const [deliveries, setDeliveries] = useState(null);


  useEffect(() => {
    const start = async () => {
      setLoadingFinalProjects(true);
      const finalProjectsData = await getPublicProjects(
        user,
        period
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

    const downloadFinalFile = async (groupId, groupNumber, _period) => {
      try {
        await downloadProject(groupId, user, _period, "final-project", groupNumber);
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
          maxWidth: "none", // Para que el maxWidth no limite el tamaño
        }}
      >
      <Root>
        <Grid container spacing={3}>
          {/* Sidebar */}
          {/* Contenido */}
          <Grid item xs={12}>
            <Box mt={2}>{renderContent()}</Box>
          </Grid>
        </Grid>
      </Root>
    </Container>
  );
};

export default PublicPDFView;