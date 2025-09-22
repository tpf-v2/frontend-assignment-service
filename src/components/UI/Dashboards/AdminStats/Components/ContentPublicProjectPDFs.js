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
import { useParams } from "react-router-dom";
import { getPublicProjectsMetadata } from "../../../../../api/handleProjects";

const ContentPublicPdfProjects = ({
  loadingProjects,
  deliveries,
  downloadFile,
  projectType,
}) => {
  const [period, setPeriod] = useState(useParams().period);
  const [groupsData, setGroupsData] = useState(useParams().period);
  useEffect(() => {
    const getData = async () => {
      try {
        const groupsData = await getPublicProjectsMetadata(null, period)
        setGroupsData(groupsData)
      } catch (error) {
        console.error("Error al obtener datos del proyecto:", error);
      } 
    };
    getData();
  }, [])

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
  // Función para obtener el nombre del tutor por su id
  const TrygetTutorNameById = (gData, entrega, _) => {
    let groupData = gData.find((g) => parseInt(getGroup(entrega.name)) === g.id)
    let ret = groupData.tutor_name
    return ret.name + " " + ret.last_name
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
                  <TableCell>{getGroupNumber(entrega.name)}</TableCell>
                  <TableCell>
                    {TrygetTutorNameById(groupsData, entrega, period) }
                  </TableCell>
                  <TableCell>
                    {
                    groupsData ? groupsData.find(
                       (g) => parseInt(getGroup(entrega.name)) === g.id
                        )?.final_report_title ||
                        `Proyecto Final Equipo ${getGroupNumber(entrega.name)}` : ""
                    }
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
