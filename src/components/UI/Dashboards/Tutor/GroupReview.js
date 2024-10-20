import React, { useEffect, useState } from "react";
import { Typography, Box, TextField, Button } from "@mui/material";
import { styled } from "@mui/system";
import {
  downloadAnteproyecto,
  fetchAnteproyectoPdf,
} from "../../../../api/downloadAnteproyecto";
import { useSelector } from "react-redux";
import { notifyGroup } from "../../../../api/notifyGroup";
import { updateGroup } from "../../../../api/updateGroups";

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

const GroupReview = ({ group }) => {
  const [comment, setComment] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const period = useSelector((state) => state.period);
  const user = useSelector((state) => state.user);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const downloadFile = async () => {
    try {
      console.log(period);
      await downloadAnteproyecto(group.id, user, period.period_id);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log(`Comentario para Grupo ${group.id}: ${comment}`);
      await notifyGroup(user, comment, group.id);
      group.pre_report_approved = true;
      await updateGroup(user, period.period_id, group);
    } catch (error) {
      console.error("Error al enviar feedback:", error);
    } finally {
      setComment("");
    }
  };

  // Función para cargar el PDF en la previsualización
  const loadPdfPreview = async () => {
    try {
      const url = await fetchAnteproyectoPdf(group.id, user, period.period_id);
      setPdfUrl(url); // Guarda la URL en el estado
    } catch (error) {
      console.error("Error al cargar la previsualización del PDF:", error);
    }
  };

  useEffect(() => {
    loadPdfPreview();
  }, [group.id, user, period]);

  return (
    <GroupReviewContainer>
      <Typography variant="h4" align="center" gutterBottom>
        Anteproyecto
      </Typography>

      <PdfPreviewBox>
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
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
      <DownloadButton variant="contained" onClick={downloadFile}>
        Descargar PDF
      </DownloadButton>

      <Box
        sx={{
          width: "100%",
          marginTop: 2,
        }}
      >
        <Typography variant="h6" mb={1}>
          Feedback
        </Typography>
        <TextField
          multiline
          rows={4}
          value={comment}
          onChange={handleCommentChange}
          variant="outlined"
          placeholder="Escribe tu comentario aquí..."
          sx={{ mb: 2, width: "100%" }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          color="primary"
          sx={{ width: "100%", borderRadius: "4px" }} // Botón de enviar que también ocupa todo el ancho
        >
          Enviar
        </Button>
      </Box>
    </GroupReviewContainer>
  );
};

export default GroupReview;
