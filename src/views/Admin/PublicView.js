import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Box, Grid, TextField, Title } from "@mui/material";
import { downloadProject, getPublicProjects } from "../../api/handleProjects";
import ContentPublicPdfProjects from "../../components/UI/Dashboards/AdminStats/Components/ContentPublicProjectPDFs";
import { RootWhite, TopPaddedContainer } from "../../components/Root";
import { TitleSpaced } from "../../styles/Titles";
// Estilos
const Root = RootWhite;

const PublicPDFView = () => {
  const user = useSelector((state) => state.user);
  const period = useParams().period;
  const [loadingFinalProjects, setLoadingFinalProjects] = useState(true);
  const [deliveries, setDeliveries] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const start = async () => {
      setLoadingFinalProjects(true);
      // Period undefined trae todos los projects
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
    }, [period]);

    const downloadFinalFile = async (groupId, groupNumber, _period) => {
      try {
        await downloadProject(groupId, user, _period, "final-project", groupNumber);
      } catch (error) {
        console.error("Error al descargar el archivo:", error);
        return "failure"
      }
    };

    // Filtrar trabajos según el término de búsqueda
    const filteredDeliveries = deliveries?.filter(
      (project) =>
        project?.final_report_title?.name.toLowerCase().includes(searchTerm.toLowerCase()) || // título
        
        project?.students?.some(  // estudiantes
          (student) =>
            student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase()) // aux: no tienen email acá
        ) ||

        project?.tutor_name?.name.toLowerCase().includes(searchTerm.toLowerCase()) || // tutor
        project?.tutor_name?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        
        project?.final_report_summary?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) || // descripción
        
        (project?.topic  // tema (aux: tienen acá?)
          ? project.topic.name.toLowerCase().includes(searchTerm.toLowerCase())
          : false) || // Filtrar por tema
        String(project?.group_number)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    console.log("--- deliveries:", deliveries);

    const renderContent = () => {
      return (
        <ContentPublicPdfProjects
          loadingProjects={loadingFinalProjects}
          deliveries={filteredDeliveries}
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
        <TopPaddedContainer>
          <TitleSpaced variant="h4">Trabajos Anteriores</TitleSpaced>
        </TopPaddedContainer>
        <TextField
          label="Buscar"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
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