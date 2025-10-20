import { useEffect, useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";
import { downloadProject, fetchProjectPdf } from "../../../../api/handleProjects";
import MySnackbar from "../../MySnackBar";

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
const StudentOverview = ({ group_id }) => {
  const [pdfUrlInitial, setPdfUrlInitial] = useState(null);
  const [pdfUrlFinal, setPdfUrlFinal] = useState(null);
  const user = useSelector((state) => state.user);

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
      // Función para cargar el PDF en la previsualización
    const loadPdfPreview = async () => {
      try {
        
        if (!!user && !!user.period_id && !!group_id) {
          console.log("good")
          const urlinit = await fetchProjectPdf(group_id, user, user.period_id, 'initial');
          setPdfUrlInitial(urlinit); // Guarda la URL en el estado
          const urlfin = await fetchProjectPdf(group_id, user, user.period_id, 'final');
          setPdfUrlFinal(urlfin); // Guarda la URL en el estado
        }
        
      } catch (error) {
        console.error("Error al cargar la previsualización del PDF:", error);
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
      <PdfPreviewBox>
        {pdfUrlInitial ? (
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
      <DownloadButton variant="contained" onClick={event => downloadFile('initial-project')} marginBottom="1rem">
        Descargar PDF
      </DownloadButton>
      <Typography variant="h5" align="center" marginTop="1em">
        Reporte Final
      </Typography>
      <PdfPreviewBox>
        {pdfUrlFinal ? (
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
      {/* Botón para descargar el PDF */}
      <DownloadButton variant="contained" onClick={event => downloadFile('final-project')} marginBottom="1rem">
        Descargar PDF
      </DownloadButton>

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
