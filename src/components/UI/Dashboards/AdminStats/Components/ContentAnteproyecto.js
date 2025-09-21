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
import { updateGroup } from "../../../../../api/updateGroups";
import { setGroups } from "../../../../../redux/slices/groupsSlice";

const ContentPdfProjects = ({
  loadingProjects,
  deliveries,
  downloadFile,
  projectType,
}) => {
  let groupsData = Object.values(useSelector((state) => state.groups))
    .sort((a, b) => a.id - b.id)
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  const tutors = Object.values(useSelector((state) => state.tutors))
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.period);
  const [selectedReviewers, setSelectedReviewers] = useState({});
  const dispatch = useDispatch();

  const [selectedFilterData, setSelectedFilterData] = useState("");//(groupsData);
  const [selectedEntregaron, setSelectedEntregaron] = useState(true);
  const [selectedNoEntregaron, setSelectedNoEntregaron] = useState(false);
  


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
  const handleReviewerChange = async (deliveryId, reviewerId) => {
    setSelectedReviewers({
      ...selectedReviewers,
      [deliveryId]: reviewerId,
    });
    // Obtener el equipo y crear una copia modificable
    const updatedGroup = { ...getGroupById(parseInt(deliveryId, 10)) };

    if (updatedGroup) {
      // Asignar el reviewerId a la copia del equipo
      updatedGroup.reviewer_id = reviewerId;

      // Llamar al backend para actualizar el equipo
      await updateGroup(user, period.id, updatedGroup);

      // Crear una nueva lista de equipos actualizados
      const updatedGroups = groupsData.map((group) =>
        group.id === updatedGroup.id ? updatedGroup : group
      );

      // Despachar la actualización solo del equipo modificado en Redux
      dispatch(setGroups(updatedGroups));
    }
  };

      // Función para obtener el nombre del tutor por su id
      const getTutorNameById = (id, periodId) => {
        const tutor = tutors.find(
          (t) =>
            t.tutor_periods &&
            t.tutor_periods.some((tp) => tp.period_id === periodId && tp.id === id)
        );
    
        return tutor ? tutor.name + " " + tutor.last_name : "Sin asignar"; // Si no encuentra el tutor, mostrar 'Sin asignar'
      };

  function getTeam(path) {
    const parts = path.split("/");
    return parts[1]; // Devuelve el equipo
  }

  function getGroupNumber(path) { // To-Do: función importable (usada tmb en TopicTutor)
    const parts = path.split("/");
    const group = groupsData?.find((g) => g.id === parseInt(parts[1]));
    return group ? group.group_number : null;
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
      {groupsData && (
        <Box mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Equipos que entregaron"
                value={loadingProjects ? -1 : deliveries.length}
                onClick={() => setSelectedEntregaron(!selectedEntregaron)} 
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Equipos que faltan entregar"
                value={
                  loadingProjects ? -1 : groupsData.length - deliveries.length
                }
                onClick={() => setSelectedNoEntregaron(!selectedNoEntregaron)} 
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Total de equipos"
                value={loadingProjects ? -1 : groupsData.length}
                onClick={() => {setSelectedEntregaron(true); setSelectedNoEntregaron(true)}}
              />
            </Grid>
          </Grid>
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
                Fecha de Entrega
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
              <>
              {selectedEntregaron && (//Si es equipos que sí entregaron, muestro lo que había, que al
                deliveries.map((entrega, index) => ( // basarse en deliveries son justamente quienes sí entregaron
                  <TableRow key={index}>
                    <TableCell>{getGroupNumber(entrega.name)}</TableCell>
                    <TableCell>
                      {getTutorNameById(
                        groupsData.find(
                          (g) => parseInt(getTeam(entrega.name)) === g.id
                        )?.tutor_period_id, period.id
                      )}
                    </TableCell>
                    <TableCell>
                      {projectType === "initial"
                        ? groupsData.find(
                            (g) => parseInt(getTeam(entrega.name)) === g.id
                          )?.pre_report_title ||
                          `Anteproyecto Equipo ${getGroupNumber(entrega.name)}`
                        : groupsData.find(
                            (g) => parseInt(getTeam(entrega.name)) === g.id
                          )?.final_report_title ||
                          `Proyecto Final Equipo ${getGroupNumber(entrega.name)}`}
                    </TableCell>
  
                    <TableCell>{formatDate(entrega.last_modified)}</TableCell>
                    {projectType === "initial" && (
                      <TableCell>
                        <Select
                          value={
                            selectedReviewers[getTeam(entrega.name)]
                              ? selectedReviewers[getTeam(entrega.name)]
                              : getGroupById(parseInt(getTeam(entrega.name), 10))
                                  ?.reviewer_id === 0
                              ? ""
                              : getGroupById(parseInt(getTeam(entrega.name), 10))
                                  ?.reviewer_id
                          }
                          onChange={(e) =>
                            handleReviewerChange(
                              getTeam(entrega.name),
                              e.target.value
                            )
                          }
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
                    )}
                    <TableCell>
                      <IconButton
                        onClick={() => downloadFile(getTeam(entrega.name), getGroupNumber(entrega.name))}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )) // cierra deliveries.map

              )}


              {selectedNoEntregaron && (
                <>                
                {groupsData.filter((g) => !g.pre_report_date).map((g, key) => (
                  /////////

                  <TableRow key={g.id}>
                    <TableCell>{g.group_number}</TableCell>
                    <TableCell>
                      {getTutorNameById(g.tutor_period_id, period.id)}
                    </TableCell>
                    <TableCell>
                      {projectType === "initial"
                        ? g.pre_report_title ||
                          `Anteproyecto Equipo ${g.group_number}`
                        : g.final_report_title ||
                          `Proyecto Final Equipo ${g.group_number}`}
                    </TableCell>
  
                    <TableCell>{null}</TableCell>
                    {projectType === "initial" && (
                      <TableCell>
                        <Select
                          value={
                            // acá me perdí, no sé qué va acá en este Select, pero lo voy a salvar con un disabled x ahora
                            selectedReviewers[g]
                              ? selectedReviewers[g]
                              : g
                                  ?.reviewer_id === 0
                              ? ""
                              : g
                                  ?.reviewer_id
                          }
                          onChange={(e) =>
                            handleReviewerChange(
                              g,
                              e.target.value
                            )
                          }
                          displayEmpty
                          disabled //agrego
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
                    )}
                    <TableCell>
                      <IconButton
                        disabled
                      >
                        <DownloadIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>



                  /////////
                ))}
                </>
                
              )}

              </>

              
            )}
            
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ContentPdfProjects;
