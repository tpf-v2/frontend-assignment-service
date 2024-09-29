import { Button, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import { downloadAnteproyecto, fetchAnteproyectoPdf } from "../../../../../api/downloadAnteproyecto";
import { useSelector } from "react-redux";

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

const AnteproyectoComponent = ({ groupId }) => {
  const period = useSelector((state) => state.period);
  const user = useSelector((state) => state.user);
  const [pdfUrl, setPdfUrl] = useState(null);

  const downloadFile = async () => {
    try {
      console.log(period);
      await downloadAnteproyecto(groupId, user, period.period_id);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    }
  };

  // Función para cargar el PDF en la previsualización
  const loadPdfPreview = async () => {
    try {
      const url = await fetchAnteproyectoPdf(groupId, user, period.period_id);
      setPdfUrl(url); // Guarda la URL en el estado
    } catch (error) {
      console.error("Error al cargar la previsualización del PDF:", error);
    }
  };

  useEffect(() => {
    loadPdfPreview();
  }, [groupId, user, period]);

  return (
    <>
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
          <Typography>Previsualización de PDF</Typography>
        )}
      </PdfPreviewBox>
      {/* Botón para descargar el PDF */}
      <DownloadButton variant="contained" onClick={downloadFile}>
        Descargar PDF
      </DownloadButton>
    </>
  );
};

export default AnteproyectoComponent;
