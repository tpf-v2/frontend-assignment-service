import { useEffect, useState } from "react";
import { Typography, Box, Button, Link } from "@mui/material";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";
import { downloadProject, fetchProjectPdf } from "../../../../api/handleProjects";
import MySnackbar from "../../MySnackBar";
import { getIntermediateProject } from "../../../../api/intermeadiateProjects";
import { useNavigate } from 'react-router-dom';

// Estilos
const GroupReviewContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: theme.spacing(2),
  padding: theme.spacing(3),
  // border: "1px solid #ccc",
  borderRadius: "8px",
  // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#ffffff",
  width: "100%",
}));

const PdfPreviewBox = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "500px", // Mantén altura fija
  border: "1px solid #ccc",
  borderRadius: "4px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f9f9f9",
  marginTop: theme.spacing(2),
}));

const DownloadButton = styled(Button)(({ theme }) => ({
  width: "100%", // Hacer que el botón sea igual de largo
  marginTop: theme.spacing(2), // Espaciado superior
  backgroundColor: "#0072C6",
  color: "#ffffff",
  "&:hover": {
    backgroundColor: "#005B9A",
  },
  borderRadius: "4px",
}));

// Copypaste de Tutor/GroupReview sin funcionalidad de comentario
const StudentOverview = ({ group_id, team, period }) => {
  const [pdfUrlInitial, setPdfUrlInitial] = useState(null);
  const [pdfUrlFinal, setPdfUrlFinal] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  period = useSelector((state) => state.period);
  
  const loadIntermediateProject = async () => {
    try {
      const response = await getIntermediateProject(group_id, user, user.period_id);
      setVideoUrl(response.intermediate_assigment); // Guarda la URL en el estado
    } catch (error) {
      console.error("Error al cargar la previsualización del video:", error);
    }
  };

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  const downloadFile = async (projectType) => {
    try {
      await downloadProject(group_id, user, user.period_id, projectType, group_id);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
  };

  useEffect(() => {
    loadIntermediateProject();
  }, [group_id, user, user.period_id]);
  useEffect(() => {
      // Función para cargar el PDF en la previsualización
    const loadPdfPreview = async () => {
      try {

        if (!!user && !!user.period_id && !!group_id && !!team) {
          if (!!team.pre_report_date) {
            const urlinit = await fetchProjectPdf(group_id, user, user.period_id, 'initial');
            setPdfUrlInitial(urlinit); // Guarda la URL en el estado
          } else {
            setPdfUrlInitial("failed")
          }
        }
      } catch (error) {
        console.error("Error al cargar la previsualización del PDF inicial:", error);
        setPdfUrlInitial("failed"); // Guarda la URL en el estado
      }
      try {
        if (!!user && !!user.period_id && !!group_id && !!team) {
          if (!!team.final_report_date) {
            const urlfin = await fetchProjectPdf(group_id, user, user.period_id, 'final');
            setPdfUrlFinal(urlfin); // Guarda la URL en el estado
          } else {
            setPdfUrlFinal("failed"); // Guarda la URL en el estado
          }
        }
        
      } catch (error) {
        console.error("Error al cargar la previsualización del PDF final:", error);
          setPdfUrlFinal("failed"); // Guarda la URL en el estado
      }
    };
    loadPdfPreview();
  }, [user, group_id]);

  return (
    <GroupReviewContainer>
      <Typography variant="h4" align="center" gutterBottom>
        Entregas
      </Typography>
      <Typography variant="h5" align="center" marginTop="1em">
        Anteproyecto
      </Typography>
      {pdfUrlInitial != "failed" ? (
        <>
        <PdfPreviewBox>
          {!!pdfUrlInitial ? (
            <iframe
              src={pdfUrlInitial}
              title="Previsualización del PDF"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          ) : (
            <Typography>Cargando ...</Typography>
          )}
        </PdfPreviewBox>
        {
          <DownloadButton variant="contained" onClick={event => downloadFile('initial-project')} marginbottom="1rem">
            Descargar PDF
          </DownloadButton>
        }
        </>
      ) : <Typography>No entregado.</Typography>}
      {
        !!period.initial_project_active && <DownloadButton variant="contained" onClick={event => navigate("/upload/initial-project")} marginbottom="1rem">
          Entregar
        </DownloadButton>
      }
      <Typography variant="h5" align="center" marginTop="1em">
        Entrega Intermedia
      </Typography>
      {!!videoUrl ? (<DownloadButton href={videoUrl} target="_blank" rel="noopener">
        Ver Video
      </DownloadButton>) : <Typography>No entregado.</Typography>}
      {
        !!period.intermediate_project_active && <DownloadButton variant="contained" onClick={event => navigate("/upload/intermediate-project")} marginbottom="1rem">
          Entregar
        </DownloadButton>
      }
      <Typography variant="h5" align="center" marginTop="1em">
        Reporte Final
      </Typography>
      {pdfUrlFinal != "failed" ? (
        <>
        <PdfPreviewBox>
          {!!pdfUrlFinal ? (
            <iframe
              src={pdfUrlFinal}
              title="Previsualización del PDF"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          ) : (
            <Typography>Cargando ...</Typography>
          )}
        </PdfPreviewBox>
        {
          <DownloadButton variant="contained" onClick={event => downloadFile('final-project')} marginbottom="1rem">
            Descargar PDF
          </DownloadButton>
        }
        </>
      ) : <Typography>No entregado.</Typography>}
      <DownloadButton variant="contained" onClick={event => navigate("/upload/final-project")} marginbottom="1rem">
        Entregar
      </DownloadButton>
      {/* Botón para descargar el PDF */}

      <MySnackbar
        open={notification.open}
        handleClose={handleSnackbarClose}
        message={notification.message}
        status={notification.status}
      />
    </GroupReviewContainer>
  );
};

export default StudentOverview;
