import { useState, useEffect } from "react";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Grid,
  Paper,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const ContentPublicPdfProjects = ({
  loadingProjects,
  deliveries,
  downloadFile,
  projectType,
}) => {
  if (loadingProjects) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Equipo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tutor</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Título</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Descipción
              </TableCell>
              {projectType === "initial" && (
                <TableCell sx={{ fontWeight: "bold" }}>Revisor</TableCell>
              )}
              <TableCell sx={{ fontWeight: "bold" }}>Descargar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingProjects ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              deliveries.map((entrega, index) => (
                <TableRow key={index}>
                  <TableCell>{entrega.group_number}</TableCell>
                  <TableCell>
                    { entrega.project.tutor_name.name + " " + entrega.project.tutor_name.last_name }
                  </TableCell>
                  <TableCell>
                    {
                      entrega.project?.final_report_title || `Proyecto Final Equipo ${entrega.group_number}`
                    }
                  </TableCell>

                  <TableCell>
                    {
                      entrega.project.final_report_summary
                      ? entrega.project.final_report_summary 
                      : <p style={{ fontStyle: 'italic' }}> {"Sin descripción"} </p>
                    }
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => downloadFile(entrega.project.id, entrega.group_number)}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ContentPublicPdfProjects;
