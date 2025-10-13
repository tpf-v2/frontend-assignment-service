import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { Box } from "@mui/system";
import StatCard from "./StatCard";
import { useSelector } from "react-redux";
import { getTutorNameById, formatDate } from "../../../../../utils/getEntitiesUtils";

const ContentIntermediateProject = () => {
  const period = useSelector((state) => state.period);

  // Obtiene los datos de los equipos del estado
  let teams = Object.values(useSelector((state) => state.groups))
    .sort((a, b) => a.id - b.id)
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  const tutors = Object.values(useSelector((state) => state.tutors))
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  // Equipos que han hecho su entrega intermedia
  const teamsWhoDelivered = teams.filter(
    (team) => team.intermediate_assigment !== null
  );

  const [selectedEntregaron, setSelectedEntregaron] = useState(true);
  const [selectedNoEntregaron, setSelectedNoEntregaron] = useState(false);


  return (
    <>
      {teams && (
        <>
          {/* Tarjetas con cantidades */}
          <Box mt={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <StatCard
                  title="Equipos que entregaron"
                  value={teamsWhoDelivered.length}
                  onClick={() => {setSelectedEntregaron(true); setSelectedNoEntregaron(false)}} 
                  selected={selectedEntregaron}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard
                  title="Equipos que faltan entregar"
                  value={teams.length - teamsWhoDelivered.length}
                  onClick={() => {setSelectedEntregaron(false); setSelectedNoEntregaron(true)}}
                  selected={selectedNoEntregaron}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard
                title="Total de equipos"
                value={teams.length}
                onClick={() => {setSelectedEntregaron(true); setSelectedNoEntregaron(true)}}
                selected={selectedEntregaron && selectedNoEntregaron}
                />
              </Grid>
            </Grid>
          </Box>

          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Equipo</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Tutor</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Fecha de Entrega
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Link al video
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Contenido según la tarjeta clickeada (se muestran ambos bloques si ambos bools son true) */}

                {selectedEntregaron && (
                  teamsWhoDelivered.map((team, index) => (
                  <TableRow key={index}>
                    <TableCell>{team.group_number}</TableCell>
                    <TableCell>
                      {getTutorNameById(team.tutor_period_id, period.id, tutors)}
                    </TableCell>

                    <TableCell>
                      {formatDate(team.intermediate_assigment_date)}
                    </TableCell>
                    <TableCell>
                      <a
                        href={team.intermediate_assigment}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {team.intermediate_assigment}
                      </a>
                    </TableCell>
                  </TableRow>
                )))}

                {selectedNoEntregaron && (
                  teams.filter((t) => !t.intermediate_assigment).map((team, index) => (
                  <TableRow key={index}>
                    <TableCell>{team.group_number}</TableCell>
                    <TableCell>
                      {getTutorNameById(team.tutor_period_id, period.id, tutors)}
                    </TableCell>
                    <TableCell> - </TableCell>
                    <TableCell> - </TableCell>
                  </TableRow>

                )))}

              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
};

export default ContentIntermediateProject;
