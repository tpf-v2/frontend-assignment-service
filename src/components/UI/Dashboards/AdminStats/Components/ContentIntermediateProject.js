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
  // Obtiene los datos de los grupos del estado
  let groupsData = Object.values(useSelector((state) => state.groups))
    .sort((a, b) => a.id - b.id)
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  const tutors = Object.values(useSelector((state) => state.tutors))
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  // Cuenta los grupos que han entregado su proyecto intermedio
  const deliveredGroups = groupsData.filter(
    (group) => group.intermediate_assigment !== null
  );

  // Función para obtener el nombre del tutor por su id
  const getTutorNameById = (id) => {
    const tutor = tutors.find(
      (t) =>
        t.tutor_periods &&
        t.tutor_periods.length > 0 &&
        t.tutor_periods[0].id === id
    );
    return tutor ? `${tutor.name} ${tutor.last_name}` : "Sin asignar";
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
                  title="Grupos que entregaron"
                  value={deliveredGroups.length}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard
                  title="Grupos que faltan entregar"
                  value={groupsData.length - deliveredGroups.length}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatCard title="Total de grupos" value={groupsData.length} />
              </Grid>
            </Grid>
          </Box>

          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Grupo</TableCell>
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
                    <TableCell>{group.id}</TableCell>
                    <TableCell>
                      {getTutorNameById(group.tutor_period_id)}
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
