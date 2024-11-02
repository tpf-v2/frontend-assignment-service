import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/system";

// Componente para la tabla de grupos
const GroupDataTable = () => {
  // Obtener la lista de topics desde Redux
  const topics = Object.values(useSelector((state) => state.topics))
    .map(({ version, rehydrated, ...rest }) => rest)
    .filter(item => Object.keys(item).length > 0);
    
  const tutors = Object.values(useSelector((state) => state.tutors))
    .map(({ version, rehydrated, ...rest }) => rest)
    .filter(item => Object.keys(item).length > 0);
    
  const groups = Object.values(useSelector((state) => state.groups))
    .sort((a, b) => a.id - b.id)
    .map(({ version, rehydrated, ...rest }) => rest)
    .filter(item => Object.keys(item).length > 0);

  const [searchTerm, setSearchTerm] = useState("");

  const loading = false;

  // Función para obtener el nombre del topic por su id
  const getTopicNameById = (id) => {
    const topic = topics.find((t) => t.id === id);
    return topic ? topic.name : ""; // Si no encuentra el topic, mostrar 'Desconocido'
  };

  // Función para obtener el nombre del tutor por su id
  const getTutorNameById = (id) => {
    const tutor = tutors.find(
      (t) => t.tutor_periods && t.tutor_periods[0].id === id
    );
    return tutor ? tutor.name + " " + tutor.last_name : "Sin asignar"; // Si no encuentra el tutor, mostrar 'Sin asignar'
  };

  // Filtrar grupos según el término de búsqueda
  const filteredGroups = groups.filter(group => 
    group.students.some(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    (getTutorNameById(group.tutor_period_id).toLowerCase().includes(searchTerm.toLowerCase())) || // Filtrar por tutor
    (group.topic ? group.topic.name.toLowerCase().includes(searchTerm.toLowerCase()) : false) // Filtrar por tema
  );

  // Función para descargar los datos en formato CSV
  const downloadCSV = () => {
    const csvRows = [];
    csvRows.push([
      "Grupo número",
      "Nombre",
      "Apellido",
      "Email",
      "Padrón",
      "Tutor",
      "Tema asignado",
      "Preferencia 1",
      "Preferencia 2",
      "Preferencia 3"
    ].join(','));

    filteredGroups.forEach(group => {
      group.students.forEach((student, index) => {
        const row = [
          index === 0 ? group.id : '',
          student.name,
          student.last_name,
          student.email,
          student.id,
          index === 0 ? getTutorNameById(group.tutor_period_id) || "Sin asignar" : "",
          index === 0 ? (group.topic ? group.topic.name : "Sin asignar") : "",
          index === 0 ? getTopicNameById(group.preferred_topics[0]) || "" : "",
          index === 0 ? getTopicNameById(group.preferred_topics[1]) || "" : "",
          index === 0 ? getTopicNameById(group.preferred_topics[2]) || "" : "",
        ].join(',');
        
        csvRows.push(row);
      });
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'group_data.csv');
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      {/* Campo de búsqueda */}
      <TextField
        label="Buscar"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={downloadCSV} 
        sx={{ marginBottom: 2 }}
      >
        Descargar CSV
      </Button>
      <TableContainer component={Paper}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Grupo número</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Apellido</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Padrón</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tutor</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Tema asignado</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Preferencia 1</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Preferencia 2</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Preferencia 3</TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <TableRow>
              <TableCell colSpan={10} align="center">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <CircularProgress />
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            <TableBody>
              {filteredGroups.map((group) => (
                <React.Fragment key={group.id}>
                  <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                    <TableCell colSpan={10} align="center"></TableCell>
                  </TableRow>
                  <TableCell rowSpan={group.students?.length + 1} align="center">
                    {group.id}
                  </TableCell>
                  {group.students.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.last_name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.id}</TableCell>
                      <>
                        {index === 0 && (
                          <TableCell rowSpan={group.students.length} align="center">
                            {getTutorNameById(group.tutor_period_id) || "Sin asignar"}
                          </TableCell>
                        )}
                        {index === 0 && (
                          <TableCell rowSpan={group.students.length} align="center">
                            {group.topic ? group.topic.name : "Sin asignar"}
                          </TableCell>
                        )}
                        {index === 0 && (
                          <>
                            {group.preferred_topics.length === 0 ? (
                              <TableCell rowSpan={group.students.length} colSpan={3} align="center">
                                {getTopicNameById(group.topic_id)}
                              </TableCell>
                            ) : (
                              <>
                                <TableCell rowSpan={group.students.length}>
                                  {getTopicNameById(group.preferred_topics[0]) || ""}
                                </TableCell>
                                <TableCell rowSpan={group.students.length}>
                                  {getTopicNameById(group.preferred_topics[1]) || ""}
                                </TableCell>
                                <TableCell rowSpan={group.students.length}>
                                  {getTopicNameById(group.preferred_topics[2]) || ""}
                                </TableCell>
                              </>
                            )}
                          </>
                        )}
                      </>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GroupDataTable;