import {
  Button,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  CircularProgress, // Importa IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Importa el ícono Close
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { groupsTopicTutor } from "../../api/assignments";

const TopicTutor = () => {
  const period = useSelector((state) => state.period);
  const user = useSelector((state) => state.user);
  const groups = Object.values(useSelector((state) => state.groups))
    .sort((a, b) => a.id - b.id)
    .map(({ version, rehydrated, ...rest }) => rest)
    .filter((item) => Object.keys(item).length > 0);
  const topics = Object.values(useSelector((state) => state.topics))
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos

  const [openDialog, setOpenDialog] = useState(false);
  const [maxDifference, setMaxDifference] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [running, setRunning] = useState(false);

  const getGroupById = (id) => {
    const group = groups.find((g) => g.id === id);
    return group ? group : "";
  };

  const getTopicNameById = (id) => {
    const topic = topics.find((t) => t.id === id);
    return topic ? topic.name : ""; // Si no encuentra el topic, mostrar 'Desconocido'
  };

  const handleRun = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseResults = () => {
    setShowResults(false);
  };

  const handleRunAlgorithm = async () => {
    try {
      setRunning(true);
      setOpenDialog(false);
      setShowResults(false);
      const response = await groupsTopicTutor(user, period, maxDifference);
      console.log("Groups topic tutor response:", response);
      setAssignments(response);
      setShowResults(true);
    } catch (error) {
      console.error("Error running algorithm:", error);
    } finally {
      setRunning(false);
    }
  };

  const handleRerunAlgorithm = () => {
    setShowResults(false); // Cierra el diálogo de resultados
    setMaxDifference(""); // Reinicia el valor del límite máximo
    handleRun(); // Abre el diálogo para seleccionar el límite máximo
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} sx={{ display: "flex" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Descripción
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} sx={{ display: "flex" }}>
          <Typography variant="body1" sx={{ textAlign: "justify" }}>
            Este algoritmo implementa un modelo de programación lineal para
            resolver el problema de asignación de grupos de estudiantes a
            tutores y temas, asegurando un balance en las asignaciones y
            maximizando las preferencias de los grupos. El objetivo del
            algoritmo es asignar de manera eficiente a los grupos los tutores y
            temas que mejor se alineen con sus preferencias, manteniendo un
            balance de carga de trabajo entre los tutores y respetando las
            capacidades tanto de los tutores como de los temas.
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} sx={{ display: "flex" }}>
          <Typography variant="body1" sx={{ textAlign: "justify" }}>
            Al correr el algoritmo se va a poder elegir el límite máximo
            permitido en la diferencia del número de grupos asignados a cada
            tutor. Tener en cuenta que este máximo va a estar limitado a la
            capacidad de cada tutor. Este parámetro se utiliza para garantizar
            que la carga de trabajo entre los tutores sea equitativa, es decir,
            que la cantidad de grupos asignados a un tutor no difiera demasiado
            de la cantidad asignada a otro tutor. Por esta razón, este algoritmo
            puede ejecutarse <strong>varias veces</strong> modificando este
            parámetro.
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          md={12}
          sx={{ display: "flex", justifyContent: "right" }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleRun}
            disabled={
              period.topics_tutors_assignment_completed ||
              !period.groups_assignment_completed
            }
          >
            Correr
          </Button>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Seleccione el límite máximo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Límite máximo en la diferencia"
            type="number"
            fullWidth
            value={maxDifference}
            onChange={(e) => setMaxDifference(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleRunAlgorithm} color="primary">
            Correr
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popup de Carga */}
      <Dialog
        open={running}
        onClose={() => setRunning(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress />
          <Typography sx={{ marginTop: 2 }}>
            Asignando tema y tutor a cada grupo...
          </Typography>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showResults}
        onClose={handleCloseResults}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          Resultados
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseResults}
            aria-label="close"
            sx={{ position: "absolute", right: 8, top: 8, marginRight: 2 }} // Agrega un margen derecho
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: "60vh" }}>
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Grupo</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Tutor Asignado
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Tema asignado
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Preferencia 1
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Preferencia 2
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Preferencia 3
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {assignments?.length > 0 ? (
                  assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell align="center">{assignment.id}</TableCell>
                      <TableCell align="center">
                        {assignment.tutor
                          ? `${assignment.tutor.name} ${assignment.tutor.last_name}`
                          : "Sin asignar"}
                      </TableCell>
                      <TableCell align="center">
                        {assignment.topic
                          ? assignment.topic.name
                          : "No asignado"}
                      </TableCell>
                      <TableCell align="center">
                        {getTopicNameById(
                          getGroupById(assignment.id).preferred_topics[0]
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {getTopicNameById(
                          getGroupById(assignment.id).preferred_topics[1]
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {getTopicNameById(
                          getGroupById(assignment.id).preferred_topics[2]
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No hay resultados disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button variant="outlined" color="primary">
            Editar resultado
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleRerunAlgorithm}>
            Volver a correr algoritmo
          </Button>
          <Button variant="contained" color="success">
            Confirmar resultados
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TopicTutor;
