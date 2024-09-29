import React, { useState } from "react";
import { Typography, Box, TextField, Button } from "@mui/material";
import { styled } from "@mui/system";

// Estilos
const GroupReviewContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: theme.spacing(2),
  padding: theme.spacing(3),
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#ffffff",
  width: "100%",
}));

const PdfPreviewBox = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "300px", // Mantén altura fija
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

const GroupReview = ({ groupId, pdfUrl }) => {
  const [comment, setComment] = useState("");

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = () => {
    console.log(`Comentario para Grupo ${groupId}: ${comment}`);
    setComment("");
  };

  return (
    <GroupReviewContainer>
      <Typography variant="h4" align="center" gutterBottom>
        Grupo {groupId}
      </Typography>

      {/* Botón para descargar el PDF */}
      <DownloadButton 
        variant="contained" 
        href={pdfUrl} 
        download
      >
        Descargar PDF
      </DownloadButton>

      <PdfPreviewBox>
        <Typography>Previsualización de PDF</Typography>
      </PdfPreviewBox>

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