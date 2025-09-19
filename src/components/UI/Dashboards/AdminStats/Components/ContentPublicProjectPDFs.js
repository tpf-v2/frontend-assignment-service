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
  Grid,
  Paper,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import StatCard from "./StatCard";
import DownloadIcon from "@mui/icons-material/Download";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ContentPublicPdfProjects = ({
  loadingProjects,
  deliveries,
  downloadFile,
  projectType,
}) => {
  const [period, setPeriod] = useState(useParams().period);

  let groupsData = Object.values(useSelector((state) => state.groups))
    .sort((a, b) => a.id - b.id)
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  const tutors = Object.values(useSelector((state) => state.tutors))
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
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

  const getGroupById = (id) => {
    const group = groupsData?.find((g) => g.id === id);
    return group ? group : null;
  };

  // Función para obtener el nombre del tutor por su id
  const TrygetTutorNameById = (gData, entrega, period) => {
    let _find = gData.find((g) => parseInt(getGroup(entrega.name)) === g.id)?.tutor_period_id
    console.log("find: ", _find)
    console.log("period: ", period)
    let ret = getTutorNameById(_find, period)
    console.log(ret)
    return ret
  };
  const getTutorNameById = (id, periodId) => {
    console.log(tutors)
    console.log(periodId)
    console.log(id)
    const tutor = tutors.find(
      (t) =>
        t.tutor_periods &&
        t.tutor_periods.some((tp) => tp.period_id === periodId && tp.id === id)
    );

    return tutor ? tutor.name + " " + tutor.last_name : "Sin asignar"; // Si no encuentra el tutor, mostrar 'Sin asignar'
  };

  function getGroup(path) {
    const parts = path.split("/");
    return parts[1]; // Devuelve el equipo
  }

  function getGroupNumber(path) {
    const parts = path.split("/");
    const group = groupsData?.find((g) => g.id === parseInt(parts[1]));
    return group ? group.group_number : null;
  }

  return (
    <div>
      {groupsData && (
        <Box mt={4}>
        </Box>
      )}

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Equipo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tutor</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Titulo</TableCell>
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
                  <TableCell>{getGroupNumber(entrega.name)}</TableCell>
                  <TableCell>
                    {TrygetTutorNameById(groupsData, entrega, period)}
                  </TableCell>
                  <TableCell>
                    {groupsData.find(
                          (g) => parseInt(getGroup(entrega.name)) === g.id
                        )?.final_report_title ||
                        `Proyecto Final Equipo ${getGroupNumber(entrega.name)}`}
                  </TableCell>

                  <TableCell>{entrega.description ? entrega.description : "<i>Sin descripción</i>"}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => downloadFile(getGroup(entrega.name), getGroupNumber(entrega.name))}
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
