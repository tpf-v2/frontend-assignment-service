import React, { useState } from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  CircularProgress,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { incompleteGroups } from "../../../../api/assignments";
import { useDispatch, useSelector } from "react-redux";
import { getGroups } from "../../../../api/getGroups";
import { setGroups } from "../../../../redux/slices/groupsSlice";
import { togglePeriodSetting } from "../../../../redux/slices/periodSlice";
import updatePeriod from "../../../../api/updatePeriod";
import { useNavigate } from "react-router-dom";

const IncompleteGroups = () => {
  const period = useSelector((state) => state.period);
  const user = useSelector((state) => state.user);
  const groups = Object.values(useSelector((state) => state.groups))
    .sort((a, b) => a.id - b.id)
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  const tutors = Object.values(useSelector((state) => state.tutors))
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  const topics = Object.values(useSelector((state) => state.topics))
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleRun = async () => {
    try {
      // Inicia la carga y abre el diálogo
      setLoading(true);
      setOpenDialog(true);

      // Obtiene los grupos incompletos
      const response = await incompleteGroups(user, period);
      console.log("Incomplete groups response:", response);

      // Obtiene y actualiza los grupos en el estado global
      const groups = await getGroups(user, period);
      dispatch(setGroups(groups));

      // Alterna la configuración de 'groups_assignment_completed' si es necesario
      dispatch(togglePeriodSetting({ field: "groups_assignment_completed" }));

      // Crea el objeto de configuración actualizado
      const updatedSettings = {
        id: period.id,
        ...period,
        groups_assignment_completed: true, // Actualización directa
      };

      // Llama a la función de actualización del período
      const result = await updatePeriod(updatedSettings, user);
      console.log("Updated successfully:", result);

      // Redirige al usuario después de completar la acción
      //   navigate(`/dashboard/${period.id}/groups`);
    } catch (error) {
      // Manejo de errores global
      console.error("Error in handleRunStep1:", error);
    } finally {
      // Finaliza la carga independientemente de si hubo un error o no
      setLoading(false);
      setOpenDialog(false);
    }
  };

  // Función para obtener el nombre del tutor por su id
  const getTutorNameById = (id) => {
    const tutor = tutors.find(
      (t) => t.tutor_periods && t.tutor_periods[0].id === id
    );
    return tutor ? tutor.name + " " + tutor.last_name : "Sin asignar"; // Si no encuentra el topic, mostrar 'Sin asignar'
  };

  // Función para obtener el nombre del topic por su id
  const getTopicNameById = (id) => {
    const topic = topics.find((t) => t.id === id);
    return topic ? topic.name : ""; // Si no encuentra el topic, mostrar 'Desconocido'
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2}>
        {/* Descripción */}
        <Grid item xs={12} md={12} sx={{ display: "flex" }}>
          {/* <Paper elevation={3} sx={{ padding: 2, flexGrow: 1 }}> */}
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Descripción
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} sx={{ display: "flex" }}>
          <Typography variant="body1" sx={{ textAlign: "justify" }}>
            Este algoritmo utiliza programación lineal para formar grupos de
            estudiantes incompletos (con menos de 4 miembros) a partir de grupos
            existentes. El objetivo es combinar grupos incompletos para formar
            tantos grupos completos de 4 estudiantes como sea posible,
            maximizando el número de grupos y teniendo en cuenta las
            preferencias de temas de los estudiantes.
          </Typography>
        </Grid>
        <Grid item xs={12} md={10} sx={{ display: "flex" }}>
          <Typography variant="body1">
            Este algoritmo se puede correr <strong>una única vez</strong>.
          </Typography>
        </Grid>
        {/* Botones Correr, Editar */}
        <Grid
          item
          xs={12}
          md={2}
          sx={{ display: "flex", justifyContent: "right" }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleRun}
            disabled={period.groups_assignment_completed}
            sx={{
              padding: "6px 26px", // Tamaño más grande del botón
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Sombra para darle protagonismo
              transition: "all 0.3s ease", // Suavizar la transición al hover
            }}
          >
            Correr
          </Button>
        </Grid>
        {/* </Paper> */}
      </Grid>

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
        {period.groups_assignment_completed && (
          <Button
            variant="outlined"
            onClick={() => navigate(`/dashboard/${period.id}/groups`)}
            sx={{
              padding: "6px 16px",
              textTransform: "none", // Evitar que el texto esté en mayúsculas
            }}
          >
            Ver más información de los grupos
          </Button>
        )}
      </Grid>

      {/* Sección de Tabla y Botón a la derecha */}
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
          style={{ marginTop: "20px", maxHeight: "400px", flexGrow: 1 }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Grupo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Cantidad de integrantes
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Preferencia 1</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Preferencia 2</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Preferencia 3</TableCell>
              </TableRow>
            </TableHead>
            {!period.groups_assignment_completed ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography>
                      Correr el algoritmo para obtener los resultados
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              <TableBody>
                {groups
                  .filter(
                    (group) =>
                      group.preferred_topics &&
                      group.preferred_topics.length > 0
                  ) // Filtrar grupos que tienen preferred_topics
                  .map((group) => (
                    <React.Fragment key={group.id}>
                      {/* Fila del grupo */}
                      <TableCell
                        rowSpan={group.students?.length + 1}
                        align="center"
                      >
                        {group.id}
                      </TableCell>
                      {/* Iterar sobre los estudiantes del grupo */}
                      {group.students.map((student, index) => (
                        <TableRow key={student.id}>
                          <>
                            {index === 0 && (
                              <TableCell
                                rowSpan={group.students.length}
                                align="center"
                              >
                                {group.students.length}{" "}
                                {/* Mostrar el tutor del grupo */}
                              </TableCell>
                            )}
                          </>
                          {/* Mostrar preferencias o topic_id dependiendo de si preferred_topics está vacío */}
                          {index === 0 && (
                            <>
                              {group.preferred_topics.length === 0 ? (
                                <TableCell
                                  rowSpan={group.students.length}
                                  colSpan={3}
                                  align="center"
                                >
                                  {getTopicNameById(group.topic_id)}{" "}
                                  {/* Mostrar nombre del topic */}
                                </TableCell>
                              ) : (
                                <>
                                  <TableCell rowSpan={group.students.length}>
                                    {getTopicNameById(
                                      group.preferred_topics[0]
                                    ) || ""}
                                  </TableCell>
                                  <TableCell rowSpan={group.students.length}>
                                    {getTopicNameById(
                                      group.preferred_topics[1]
                                    ) || ""}
                                  </TableCell>
                                  <TableCell rowSpan={group.students.length}>
                                    {getTopicNameById(
                                      group.preferred_topics[2]
                                    ) || ""}
                                  </TableCell>
                                </>
                              )}
                            </>
                          )}
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>

        {/* <Box
            sx={{ display: "flex", alignItems: "center", marginLeft: "16px" }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate(`/dashboard/${period.id}/groups`)}
            >
              Ver más información de los grupos
            </Button>
          </Box> */}
      </Grid>

      {/* Spinner de carga */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        // fullScreen={fullScreen}
        maxWidth="lg"
        fullWidth
        sx={{
          height: "100%",
          maxHeight: "100vh",
        }}
      >
        <DialogTitle>{!loading && "Grupos Formados"}</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            minHeight: "300px",
            maxHeight: "100vh",
            minWidth: "300px",
          }}
        >
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Armando grupos...</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      {/* </Grid> */}
    </Box>
  );
};

export default IncompleteGroups;
