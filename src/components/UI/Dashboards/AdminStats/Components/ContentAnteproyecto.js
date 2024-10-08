import React, { useState } from "react";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Button,
  Grid,
  Paper,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import StatCard from "./StatCard";
import DownloadIcon from "@mui/icons-material/Download";
import { useSelector } from "react-redux";

const ContentAnteproyecto = ({
  loadingAnteproyectos,
  deliveries,
  groups,
  downloadFile,
}) => {
  const groupsData =  Object.values(useSelector((state) => state.groups));
  const tutors = Object.values(useSelector((state) => state.tutors)); // Asume que el slice de Redux tiene los topics
  const topics = Object.values(useSelector((state) => state.topics)); // Asume que el slice de Redux tiene los topics
  
  const [selectedReviewers, setSelectedReviewers] = useState({});

  if (loadingAnteproyectos) {
    return <CircularProgress />;
  }

  const handleReviewerChange = (deliveryId, reviewerId) => {
    //TODO: Enviar al back el revisor asignado
    setSelectedReviewers({
      ...selectedReviewers,
      [deliveryId]: reviewerId,
    });
  };

  // Función para obtener el nombre del tutor por su id
  const getTutorNameById = (id) => {
    const tutor = tutors.find((t) => t.tutor_periods && t.tutor_periods.length > 0 && t.tutor_periods[0].id === id);
    return tutor ? `${tutor.name} ${tutor.last_name}` : "Sin asignar";
  };  

  function getGroup(path) {
    const parts = path.split("/");
    return parts[1]; // Devuelve el grupo
  }

    // Función para obtener el nombre del topic por su id
    const getTopicNameById = (id) => {
      const topic = topics.find((t) => t.id === id);
      return topic ? topic.name : "Desconocido"; // Si no encuentra el topic, mostrar 'Desconocido'
    };

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
                  loadingAnteproyectos ? -1 : groups.length - deliveries.length
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
              <TableCell sx={{ fontWeight: "bold" }}>Tutor</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Titulo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Fecha de Entrega
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Revisor</TableCell>
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
                  <TableCell>{getTutorNameById(groupsData.find((g) => parseInt(getGroup(entrega.name)) === g.id)?.tutor_period_id)}</TableCell>
                  <TableCell>{getTopicNameById(groupsData.find((g) => parseInt(getGroup(entrega.name)) === g.id)?.topic_id)}</TableCell>

                  <TableCell>{formatDate(entrega.last_modified)}</TableCell>
                  <TableCell>
                      <Select
                        value={selectedReviewers[getGroup(entrega.name)] || ""}
                        onChange={(e) => handleReviewerChange(getGroup(entrega.name), e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Seleccionar Revisor
                        </MenuItem>
                        {tutors.map((tutor) => (
                          <MenuItem key={tutor.id} value={tutor.id}>
                            {tutor.name} {tutor.last_name}
                          </MenuItem>
                        ))}
                      </Select>
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
