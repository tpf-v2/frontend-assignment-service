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
import { Box } from "@mui/system";
import StatCard from "./StatCard";
import { useSelector } from "react-redux";

const ContentIntermediateProject = () => {
  const period = useSelector((state) => state.period);

  // Obtiene los datos de los equipos del estado
  let groupsData = Object.values(useSelector((state) => state.groups))
    .sort((a, b) => a.id - b.id)
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  const tutors = Object.values(useSelector((state) => state.tutors))
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  // Cuenta los equipos que han entregado su proyecto intermedio
  const deliveredGroups = groupsData.filter(
    (group) => group.intermediate_assigment !== null
  );

  // Función para obtener el nombre del tutor por su id
  const getTutorNameById = (id, periodId) => {
    const tutor = tutors.find(
      (t) =>
        t.tutor_periods &&
        t.tutor_periods.some((tp) => tp.period_id === periodId && tp.id === id)
    );

    return tutor ? tutor.name + " " + tutor.last_name : "Sin asignar"; // Si no encuentra el tutor, mostrar 'Sin asignar'
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
    <>
      {groupsData && (
        <>
          <Box mt={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <StatCard
                  title="Equipos que entregaron"
                  value={deliveredGroups.length}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard
                  title="Equipos que faltan entregar"
                  value={groupsData.length - deliveredGroups.length}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard title="Total de equipos" value={groupsData.length} />
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
                {deliveredGroups.map((group, index) => (
                  <TableRow key={index}>
                    <TableCell>{group.group_number}</TableCell>
                    <TableCell>
                      {getTutorNameById(group.tutor_period_id, period.id)}
                    </TableCell>

                    <TableCell>
                      {formatDate(group.intermediate_assigment_date)}
                    </TableCell>
                    <TableCell>
                      <a
                        href={group.intermediate_assigment}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {group.intermediate_assigment}
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
};

export default ContentIntermediateProject;
