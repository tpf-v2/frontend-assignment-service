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
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  Tooltip, // Importa IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Importa el ícono Close
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { groupsTopicTutor } from "../../api/assignments";
import { confirmGroups } from "../../api/updateGroups";
import { setGroups } from "../../redux/slices/groupsSlice";
import { togglePeriodSetting } from "../../redux/slices/periodSlice";
import updatePeriod from "../../api/updatePeriod";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";

const TopicTutor = () => {
  const period = useSelector((state) => state.period);
  const user = useSelector((state) => state.user);
  const groups = Object.values(useSelector((state) => state.groups))
    .sort((a, b) => a.group_number - b.group_number)
    .map(({ version, rehydrated, ...rest }) => rest)
    .filter((item) => Object.keys(item).length > 0);
  const topics = Object.values(useSelector((state) => state.topics))
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  const tutors = Object.values(useSelector((state) => state.tutors))
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos

  const [openDialog, setOpenDialog] = useState(false);
  const [maxDifference, setMaxDifference] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [running, setRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(null); // Almacena el id del equipo que está siendo editado
  const [originalAssignments, setOriginalAssignments] = useState([]); // Copia de assignments para restaurar si se cancela
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // Dialogo para confirmar resultados

  const [dcg, setDcg] = useState(null);
  const [algorithmType, setAlgorithmType] = useState("Programacion Lineal"); // Estado para el tipo de algoritmo

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getGroupById = (id) => {
    const group = groups.find((g) => g.id === id);
    return group ? group : "";
  };

  const getTopicNameById = (id) => {
    const topic = topics.find((t) => t.id === id);
    return topic ? topic.name : ""; // Si no encuentra el topic, mostrar 'Desconocido'
  };

  const getTopicsForTutor = (tutorId, periodId) => {
    const tutor = tutors.find(
      (t) =>
        t.id === tutorId &&
        t.tutor_periods &&
        t.tutor_periods.some((tp) => tp.period_id === periodId)
    );
  
    // Busca los temas solo del periodo correspondiente si el tutor existe
    const periodTopics = tutor
      ? tutor.tutor_periods.find((tp) => tp.period_id === periodId)?.topics
      : [];
  
    return periodTopics ? periodTopics.map((t) => t.name) : [];
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

  const getGroupNumberById = (id) => {
    const group = groups.find((g) => g.id === id);
    return group.group_number; // Si no encuentra el topic, mostrar 'Desconocido'
  }
  const handleRun = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseResults = () => {
    setShowResults(false);
  };

  // Función para manejar el comienzo de la edición
  const handleStartEditing = () => {
    setOriginalAssignments([...assignments]); // Guarda una copia de assignments antes de empezar a editar
    setIsEditing(true);
  };

  // Función para cancelar la edición y restaurar la copia original
  const handleCancelEditing = () => {
    setAssignments(originalAssignments); // Restaura la copia original
    setIsEditing(false); // Sale del modo de edición
  };

  const handleSaveChanges = () => {
    const unassignedTopics = assignments.some(
      (assignment) => !assignment.topic
    );
    if (unassignedTopics) {
      alert(
        "No puedes guardar los cambios. Asegúrate de que todos los equipos tengan un tema asignado."
      );
      return;
    }

    setIsEditing(false); // Sale del modo de edición
    setOriginalAssignments([]); // Limpia la copia original ya que se guardaron los cambios
  };

  const canSaveChanges = () => {
    return !assignments.some((assignment) => !assignment.topic);
  };

  const handleChangeTutor = (groupId, tutorId) => {
    setAssignments((prevAssignments) =>
      prevAssignments.map((assignment) =>
        assignment.id === groupId
          ? {
              ...assignment,
              tutor: tutors.find((t) => t.id === tutorId),
              topic: null, // Resetea el tema al cambiar el tutor
            }
          : assignment
      )
    );
  };

  const handleChangeTopic = (groupId, topicName) => {
    setAssignments((prevAssignments) =>
      prevAssignments.map((assignment) =>
        assignment.id === groupId
          ? { ...assignment, topic: topics.find((t) => t.name === topicName) }
          : assignment
      )
    );
  };

  const handleRunAlgorithm = async (algorithmType) => {
    try {
      setRunning(true);
      setOpenDialog(false);
      setShowResults(false);
      const response = await groupsTopicTutor(
        user,
        period,
        maxDifference,
        algorithmType
      );
      console.log("Groups topic tutor response:", response);
      setAssignments(response.assigment);
      setDcg(response.dcg);
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

  // Manejo del popup de confirmación
  const handleConfirmResults = () => {
    setOpenConfirmDialog(true); // Abrir el popup de confirmación
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false); // Cerrar el popup de confirmación
  };

  const handleAcceptResults = async () => {
    const response = await confirmGroups(user, period, assignments, groups);
    dispatch(setGroups(response));
    dispatch(
      togglePeriodSetting({ field: "topics_tutors_assignment_completed" })
    );

    // Crea el objeto de configuración actualizado
    const updatedSettings = {
      id: period.id,
      ...period,
      topics_tutors_assignment_completed: true, // Actualización directa
    };

    // Llama a la función de actualización del período
    const result = await updatePeriod(updatedSettings, user);
    console.log("Updated successfully:", result);

    setOpenConfirmDialog(false); // Cierra el popup
    setShowResults(false);
    // Lógica adicional para confirmar los resultados
  };

  const downloadCSV = () => {
    const csvRows = [];
    csvRows.push(
      [
        "Grupo número",
        "Tutor asignado",
        "Tema asignado",
        "Preferencia 1",
        "Preferencia 2",
        "Preferencia 3"
      ].join(",")
    );

    assignments.forEach((group, index) => {
      // group.students.forEach((student, index) => {
        const row = [
          getGroupNumberById(group.id),
          group.tutor ? (
            `${group.tutor.name} ${group.tutor.last_name}`
          ) : (
            "Sin asignar"
          ),
          group.topic ? (
            group.topic.name.replace(/,/g, "-")
          ) : (
            "Sin asignar"
          ),
          getTopicNameById(
            getGroupById(group.id).preferred_topics[0]
          ).replace(/,/g, "-") || "",
          getTopicNameById(
            getGroupById(group.id).preferred_topics[1]
          ).replace(/,/g, "-") ||
          "",
          getTopicNameById(
            getGroupById(group.id).preferred_topics[2]
          ).replace(/,/g, "-") ||
          ""
        ].join(",");
        csvRows.push(row);
      // });
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `topic_tutor_${maxDifference}.csv`);
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} sx={{ display: "flex" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Descripción
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} sx={{ display: "flex" }}>
          <Typography variant="body1" sx={{ textAlign: "justify" }}>
            Este algoritmo implementa un modelo de programación lineal para
            resolver el problema de asignación de equipos de estudiantes a
            tutores y temas, asegurando un balance en las asignaciones y
            maximizando las preferencias de los equipos. El objetivo del
            algoritmo es asignar de manera eficiente a los equipos los tutores y
            temas que mejor se alineen con sus preferencias, manteniendo un
            balance de carga de trabajo entre los tutores y respetando las
            capacidades tanto de los tutores como de los temas.
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} sx={{ display: "flex" }}>
          <Typography variant="body1" sx={{ textAlign: "justify" }}>
            Al correr el algoritmo se va a poder elegir el límite máximo
            permitido en la diferencia del número de equipos asignados a cada
            tutor. Tener en cuenta que este máximo va a estar limitado a la
            capacidad de cada tutor. Este parámetro se utiliza para garantizar
            que la carga de trabajo entre los tutores sea equitativa, es decir,
            que la cantidad de equipos asignados a un tutor no difiera demasiado
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

        {period.topics_tutors_assignment_completed && (
          <>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Resultados
              </Typography>

              <Button
                variant="outlined"
                onClick={() => navigate(`/dashboard/${period.id}/groups`)}
                sx={{
                  padding: "6px 16px",
                  textTransform: "none", // Evitar que el texto esté en mayúsculas
                }}
              >
                Ver más información de los equipos
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <TableContainer
                component={Paper}
                style={{ maxHeight: "300px", flexGrow: 1 }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Equipo</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Tutor Asignado
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Tema Asignado
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
                    {groups?.length > 0 ? (
                      groups
                        .filter(
                          (group) =>
                            group.preferred_topics &&
                            group.preferred_topics.length > 0
                        )
                        .map((group) => (
                          <TableRow key={group.id}>
                            <TableCell align="center">
                              {group.group_number}
                            </TableCell>

                            <TableCell>
                              {group.tutor_period_id
                                ? `${getTutorNameById(
                                    group.tutor_period_id,
                                    period.id
                                  )}`
                                : "Sin asignar"}
                            </TableCell>

                            <TableCell>
                              {group.topic ? group.topic.name : "Sin asignar"}
                            </TableCell>

                            {/* Preferencias no editables */}
                            <TableCell align="center">
                              {getTopicNameById(
                                getGroupById(group.id).preferred_topics[0]
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {getTopicNameById(
                                getGroupById(group.id).preferred_topics[1]
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {getTopicNameById(
                                getGroupById(group.id).preferred_topics[2]
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
            </Grid>
          </>
        )}
      </Grid>

      {/* Popup de Confirmación */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirmar Resultados</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Importante: Al confirmar los resultados no podrá volver a correr el
            algoritmo.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAcceptResults} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Seleccione el límite máximo</DialogTitle>
        <DialogContent>
          <NumericFormat
            fullWidth
            allowNegative={false}
            customInput={TextField}
            variant="outlined"
            autoFocus
            margin="normal"
            label="Límite máximo en la diferencia"
            value={maxDifference}
            onChange={(e) => setMaxDifference(e.target.value)}
          />
          <Select
            value={algorithmType}
            onChange={(e) => setAlgorithmType(e.target.value)} // Cambiar el tipo de algoritmo
            fullWidth
            sx={{ marginTop: 1 }}
            variant="outlined"
            margin="normal"
          >
            <MenuItem value="Programacion Lineal">Programación Lineal</MenuItem>
            <MenuItem value="Redes de flujo">Redes de Flujo</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              handleRunAlgorithm(algorithmType); // Pasar el tipo de algoritmo al manejar la ejecución
            }}
            color="primary"
          >
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
            Asignando tema y tutor a cada equipo...
          </Typography>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showResults}
        onClose={handleCloseResults}
        fullWidth
        maxWidth="xl"
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
                  <TableCell sx={{ fontWeight: "bold" }}>Equipo</TableCell>
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
                      <TableCell align="center">{getGroupNumberById(assignment.id)}</TableCell>

                      <TableCell>
                        {isEditing ? (
                          <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <Select
                              sx={{
                                fontSize: 14,
                                whiteSpace: "normal",
                                overflowWrap: "break-word",
                                maxWidth: "100%",
                              }}
                              value={assignment.tutor?.id || ""}
                              onChange={(e) => {
                                const newTutorId = e.target.value;
                                handleChangeTutor(assignment.id, newTutorId);
                              }}
                            >
                              {tutors.map((tutor) => (
                                <MenuItem
                                  key={tutor.id}
                                  value={tutor.id}
                                  sx={{ padding: "4px 8px" }}
                                >
                                  {`${tutor.name} ${tutor.last_name}`}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : assignment.tutor ? (
                          `${assignment.tutor.name} ${assignment.tutor.last_name}`
                        ) : (
                          "Sin asignar"
                        )}
                      </TableCell>

                      <TableCell>
                        {isEditing ? (
                          <FormControl
                            sx={{ m: 1, minWidth: 120, maxWidth: 300 }}
                          >
                            <Select
                              sx={{
                                fontSize: 14,
                                whiteSpace: "normal",
                                overflowWrap: "break-word",
                                maxWidth: "100%",
                              }}
                              value={assignment.topic?.name || ""}
                              onChange={(e) =>
                                handleChangeTopic(assignment.id, e.target.value)
                              }
                              displayEmpty
                              renderValue={(selected) => {
                                // Si no hay un tema seleccionado, muestra "Seleccionar tema"
                                return selected ? selected : "Seleccionar tema";
                              }}
                            >
                              {/* Filtrar los topics basados en el tutor seleccionado */}
                              {getTopicsForTutor(assignment.tutor?.id, period.id).map(
                                (topicName, index) => (
                                  <MenuItem
                                    key={index}
                                    value={topicName}
                                    sx={{ padding: "4px 8px" }}
                                  >
                                    {topicName}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </FormControl>
                        ) : assignment.topic ? (
                          assignment.topic.name
                        ) : (
                          "Sin asignar"
                        )}
                      </TableCell>

                      {/* Preferencias no editables */}
                      <TableCell >
                        {getTopicNameById(
                          getGroupById(assignment.id).preferred_topics[0]
                        )}
                      </TableCell>
                      <TableCell >
                        {getTopicNameById(
                          getGroupById(assignment.id).preferred_topics[1]
                        )}
                      </TableCell>
                      <TableCell >
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

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            flexGrow: 1,
          }}
        >
        {!isEditing && (
            <Box
              sx={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(230, 230, 250, 0.8)", // Lavanda
                border: "2px dotted #888", // Borde punteado gris
                borderRadius: 6, // Bordes redondeados
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Sombra ligera
                padding: "8px 12px", // Padding interno
              }}
            >
              <Tooltip title="DCG (Discounted Cumulative Gain) evalúa cuán relevantes son los resultados devueltos por el algoritmo, penalizando aquellos que no se eligió las primeras preferencias.">
                <Typography variant="body2">
                  {dcg !== null ? `Eficiencia (DCG): ${dcg.toFixed(2)}` : "Sin calcular"}
                </Typography>
              </Tooltip>
            </Box>
          )}

          {!isEditing && (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleStartEditing} // Comienza el modo de edición
              sx={{ margin: "0 8px" }}
            >
              Editar resultado
            </Button>
          )}
          {!isEditing && (
            <Button
            variant="contained"
            color="primary"
            onClick={downloadCSV}
            sx={{ margin: "0 8px" }}
          >
            Descargar CSV
          </Button>
          )}
          {isEditing && (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCancelEditing} // Cancela la edición y restaura la copia original
            >
              Cancelar
            </Button>
          )}
          {isEditing && (
            <Button
              onClick={handleSaveChanges}
              color="primary"
              variant="contained"
              disabled={!canSaveChanges()} // Desactiva el botón si no se pueden guardar los cambios
            >
              Guardar cambios
            </Button>
          )}

          {!isEditing && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleRerunAlgorithm}
              sx={{ margin: "0 8px" }}
            >
              Volver a correr algoritmo
            </Button>
          )}
          {!isEditing && (
            <Button
              variant="contained"
              color="success"
              onClick={handleConfirmResults}
            >
              Confirmar resultados
            </Button>
          )}

          

          
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TopicTutor;
