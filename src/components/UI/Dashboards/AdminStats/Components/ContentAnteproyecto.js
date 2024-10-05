import React from "react";
import { Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Grid, Paper, IconButton } from "@mui/material";
import StatCard from "./StatCard";
import DownloadIcon from "@mui/icons-material/Download";

const ContentAnteproyecto = ({ loadingAnteproyectos, deliveries, groups, downloadFile }) => {
  if (loadingAnteproyectos) {
    return <CircularProgress />;
  }

  function getGroup(path) {
    const parts = path.split("/");
    return parts[1]; // Devuelve el grupo
  }

  function getFileName(path) {
    const parts = path.split("/");
    return parts[2]; // Devuelve el nombre del archivo
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <div>
      {groups && (
        <Box mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Grupos que entregaron"
                value={loadingAnteproyectos ? -1 : deliveries.length}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Grupos que faltan entregar"
                value={
                  loadingAnteproyectos
                    ? -1
                    : groups.length - deliveries.length
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Total de grupos"
                value={loadingAnteproyectos ? -1 : groups.length}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Grupo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Archivo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Fecha de Entrega
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Descargar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingAnteproyectos ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              deliveries.map((entrega, index) => (
                <TableRow key={index}>
                  <TableCell>{getGroup(entrega.name)}</TableCell>
                  <TableCell>{getFileName(entrega.name)}</TableCell>
                  <TableCell>
                    {formatDate(entrega.last_modified)}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => downloadFile(getGroup(entrega.name))}
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

export default ContentAnteproyecto;
