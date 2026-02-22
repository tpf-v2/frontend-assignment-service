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
import { getTeamById, getTutorNameById, formatDate } from "../../../../../utils/getEntitiesUtils";
import { DownloadButtonWithSpinner } from "../../../../Buttons/CustomButtons";

const ContentPdfProjects = ({
  loadingProjects,
  deliveries,
  downloadFile,
  projectType,
}) => {
  let teams = Object.values(useSelector((state) => state.groups))
    .sort((a, b) => a.id - b.id)
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  const tutors = Object.values(useSelector((state) => state.tutors))
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.period);
  const [selectedReviewers, setSelectedReviewers] = useState({});
  const [downloading, setDownloading] = useState(null)
  const dispatch = useDispatch();

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

  const handleReviewerChange = async (deliveryId, reviewerId) => {
    setSelectedReviewers({
      ...selectedReviewers,
      [deliveryId]: reviewerId,
    });
    // Obtener el equipo y crear una copia modificable
    const updatedTeam = { ...getTeamById(parseInt(deliveryId, 10), teams) };

    if (updatedTeam) {
      // Asignar el reviewerId a la copia del equipo
      updatedTeam.reviewer_id = reviewerId;

      // Llamar al backend para actualizar el equipo
      await updateGroup(user, period.id, updatedTeam);

      // Crear una nueva lista de equipos actualizados
      const updatedTeams = teams.map((team) =>
        team.id === updatedTeam.id ? updatedTeam : team
      );

      // Despachar la actualización solo del equipo modificado en Redux
      dispatch(setGroups(updatedTeams));
    }
  };

  function getTeam(path) {
    const parts = path.split("/");
    return parts[1]; // Devuelve el equipo
  }

  function getTeamNumber(path) { // To-Do: función importable (usada tmb en TopicTutor)
    const parts = path.split("/");
    const team = teams?.find((g) => g.id === parseInt(parts[1]));
    return team ? team.group_number : null;
  }

  return (
    <div>
      {teams && (
        <Box mt={4}>
          {/* Tarjetas con cantidades */}          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Equipos que entregaron"
                value={loadingProjects ? -1 : deliveries.length}
                onClick={() => {setSelectedEntregaron(true); setSelectedNoEntregaron(false)}} 
                selected={selectedEntregaron}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Equipos que faltan entregar"
                value={
                  loadingProjects ? -1 : teams.length - deliveries.length
                }
                onClick={() => {setSelectedEntregaron(false); setSelectedNoEntregaron(true)}}
                selected={selectedNoEntregaron}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Total de equipos"
                value={loadingProjects ? -1 : teams.length}
                onClick={() => {setSelectedEntregaron(true); setSelectedNoEntregaron(true)}}
                selected={selectedEntregaron && selectedNoEntregaron}
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
              {/* Contenido según la tarjeta clickeada (se muestran ambos bloques si ambos bools son true) */}
              
              {selectedEntregaron && (//Si es equipos que sí entregaron, muestro lo que había, que al
                deliveries.map((entrega, index) => ( // basarse en deliveries son justamente quienes sí entregaron
                  <TableRow key={index}>
                    <TableCell>{getTeamNumber(entrega.name)}</TableCell>
                    <TableCell>
                      {getTutorNameById(
                        teams.find(
                          (t) => parseInt(getTeam(entrega.name)) === t.id
                        )?.tutor_period_id, period.id,
                        tutors
                      )}
                    </TableCell>
                    <TableCell>
                      {projectType === "initial"
                        ? teams.find(
                            (t) => parseInt(getTeam(entrega.name)) === t.id
                          )?.pre_report_title ||
                          `Anteproyecto Equipo ${getTeamNumber(entrega.name)}`
                        : teams.find(
                            (t) => parseInt(getTeam(entrega.name)) === t.id
                          )?.final_report_title ||
                          `Proyecto Final Equipo ${getTeamNumber(entrega.name)}`}
                    </TableCell>
  
                    <TableCell>{formatDate(entrega.last_modified)}</TableCell>
                    {projectType === "initial" && (
                      <TableCell>
                        <Select
                          value={
                            selectedReviewers[getTeam(entrega.name)]
                              ? selectedReviewers[getTeam(entrega.name)]
                              : getTeamById(parseInt(getTeam(entrega.name), 10), teams)
                                  ?.reviewer_id === 0
                              ? ""
                              : getTeamById(parseInt(getTeam(entrega.name), 10), teams)
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
                      <DownloadButtonWithSpinner
                        onClick={async () => {
                          setDownloading(entrega.name)
                          await downloadFile(getTeam(entrega.name), getTeamNumber(entrega.name))
                          setDownloading(null)
                        }}
                        spinningCondition={downloading === entrega.name}
                      />                      
                    </TableCell>
                  </TableRow>
                )) // cierra deliveries.map

              )}


              {selectedNoEntregaron && (
                <>                
                {teams.filter((t) =>
                  projectType === "initial"
                  ? !t.pre_report_date
                  : !t.final_report_date
                  ).map((team) => (

                  <TableRow key={team.id}>
                    <TableCell>{team.group_number}</TableCell>
                    <TableCell>
                      {getTutorNameById(team.tutor_period_id, period.id, tutors)}
                    </TableCell>
                    <TableCell>
                      {projectType === "initial"
                        ? team.pre_report_title ||
                          `Anteproyecto Equipo ${team.group_number}`
                        : team.final_report_title ||
                          `Proyecto Final Equipo ${team.group_number}`}
                    </TableCell>
  
                    <TableCell> - </TableCell>
                    {projectType === "initial" && (
                      <TableCell>
                        <Select
                          value={
                            selectedReviewers[team]
                              ? selectedReviewers[team]
                              : team.reviewer_id === 0
                              ? ""
                              : team.reviewer_id
                          }
                          onChange={(e) =>
                            handleReviewerChange(
                              team,
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
