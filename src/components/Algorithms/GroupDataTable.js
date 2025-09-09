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
  Box,
  Stack
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { Box } from "@mui/system";
import ExpandableCell from "../ExpandableCell";

import { TeamModal } from "../UI/Tables/Modals/teamModal";
import { setGroups } from "../../redux/slices/groupsSlice";
import { editGroup } from "../../api/sendGroupForm";
import MySnackbar from "../UI/MySnackBar";
import { getTableData } from "../../api/handleTableData";

// Componente para la tabla de equipos
const GroupDataTable = () => {
  const period = useSelector((state) => state.period);

  // Obtener la lista de topics desde Redux
  const topics = Object.values(useSelector((state) => state.topics))
    .map(({ version, rehydrated, ...rest }) => rest)
    .filter((item) => Object.keys(item).length > 0);

  const tutors = Object.values(useSelector((state) => state.tutors))
    .map(({ version, rehydrated, ...rest }) => rest)
    .filter((item) => Object.keys(item).length > 0);

  const groups = Object.values(useSelector((state) => state.groups))
    .sort((a, b) => a.group_number - b.group_number)
    .map(({ version, rehydrated, ...rest }) => rest)
    .filter((item) => Object.keys(item).length > 0);

  const students = Object.values(useSelector((state) => state.students))
  .map(({ version, rehydrated, ...rest }) => rest)
  .filter(item => Object.keys(item).length > 0);

  const [allTopics, setAllTopics] = useState(topics);
  // const addCustomTopicsToAllTopics = () => {
  //   // Workaround a que el back no los devuelva
  //   // agrego los temas de quienes pusieron "Ya tengo tema y tutor"
  //   const customTopics = groups.filter(team => !topics.some(t => t.id === team.topic.id))
  //   .map(team => team.topic);
  //   console.log("### Custom topics:", customTopics);
  //   setAllTopics((prevData) => [...prevData, ...customTopics]);
  // }
  const customTopics = groups.filter(team => !topics.some(t => t.id === team.topic.id))
    .map(team => team.topic);
    console.log("### Custom topics:", customTopics);
  const constAllTopics = topics.concat(customTopics);


  const [showExtraColumns, setShowExtraColumns] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [showNoTopic, setShowNoTopic] = useState(false);
  const [showNoTutor, setShowNoTutor] = useState(false);

  const [loading, setLoading] = useState(true);

  ////////// Inicio lo necesario para editar equipo, Revisar []
  const user = useSelector((state) => state.user);
  const [openConfirmEditModal, setOpenConfirmEditModal] = useState(false);
  const [conflictsMessage, setConflictsMessage] = useState([]);
  // Editar equipo
  const [openEditModal, setOpenEditModal] = useState(false);
  const [originalEditedItemId, setOriginalEditedItemId] = useState(null);
  const [itemToPassToModal, setItemToPassToModal] = useState(null);
  
  const [data, setData] = useState(groups);
  const dispatch = useDispatch();

  /// Los useEffect los pongo acá
  const endpoint = `/teams/?period=${period.id}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await getTableData(endpoint, user);
        
        console.log("Response data:", responseData);
        setData(responseData);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Handle error
      }
    };

    fetchData();
  }, [endpoint, user]);

  // useEffect(() => {
  //   // if (groups.length > 0) {
  //   //   setLoading(false);      
  //   // }
  //   if (data.length > 0) {
  //     setLoading(false);      
  //   }
  // }, [data]);

  // useEffect(() => {
  //   // Configurar un temporizador de 3 segundos
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 3000);

  //   // Limpiar el temporizador si el componente se desmonta
  //   return () => clearTimeout(timer);
  // }, []);
  /// fin useEffect
  // Aux: Editar equipo, la traigo copypaste, veré de refactorizar para reutilizar después []
  const handleEditItem = async (editedItem, setEditedItem, handleCloseEditModal, confirm_option=false) => {
    try {
      console.log("#### DESDE AFUERA, item completo:", editedItem);
      console.log("   - desde afuera tmb, topic:", editedItem.topic.id);
      console.log("   - y desde afuera tmb, get name da:", getTopicNameById(editedItem.topic.id));
      editedItem.tutor_email = getTutorEmailByTutorPeriodId(editedItem.tutor_period_id, period.id);
      await editItemInGenericTable(editGroup, editedItem, setEditedItem, setGroups, confirm_option);
      
      // Close modal de edición en caso de éxito
      handleCloseEditModal();
      setOriginalEditedItemId(null); // AUX: Agrego esto acá.
      setEditedItem({}); ///// para el segundo modal, el de confirm.
    } catch (err) {
      const title="team";
      console.error(`Error when editing ${title}:`, err);
      setNotification({
        open: true,
        message: `Error al editar equipo.`,
        status: "error",
      });
      console.log("--- CONFLICTO, VOY A ABRIR EL MODAL DE CONFIRMACIÓN ACTUALMENTE CERRADO", openConfirmEditModal);

      // Si hay conflicto, no cerrar el modal de edición; abrir cartel de confirmación
      // y si se confirma, se reenvía la request (conservar los datos a enviar) pero con un bool en true
      if (err.response?.status===409) {
        setNotification({
          open: true,
          message: `Advertencia: Conflicto al editar equipo.`,
          status: "warning",
        });
        //console.log("conflict:", err.response.data.detail);

        setConflictsMessage(err.response?.data?.detail || []);
        setOpenConfirmEditModal(true);
      }
    }
  };
  const editItemInGenericTable = async (apiEditFunction, editedItem, setEditedItem, setReducer, confirm_option=false) => {    
    const item = await apiEditFunction(editedItem.id, period.id, editedItem, user, confirm_option);
    setNotification({
      open: true,
      message: `Se editó equipo exitosamente`,
      status: "success",
    });
    setData((prevData) =>
      prevData.map((existingItem) => (existingItem.id === originalEditedItemId ? item : existingItem))
    );
    dispatch(setReducer((prevData) =>
      prevData.map((existingItem) => (existingItem.id === originalEditedItemId ? item : existingItem)))
    );
  };
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });
  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };
  /////
  // Confirmar edición con bool true
  const handleConfirmEditOnConflict = async (editedItem, setEditedItem, handleCloseEditModal, confirm_option=true) => {
    try {
      console.log("--- CONFIRMAR API CALL A PUNTO DE HACERSE");
      await handleEditItem(editedItem, setEditedItem, handleCloseEditModal, true);
      console.log("--- CONFIRMAR API CALL HECHA");
    } catch(err) {
      console.log("--- CONFIRMAR API CALL ERRÓNEA:", err);
    }
  };
  //////
  // Formato
  const getTutorEmailByTutorPeriodId = (id, periodId) => {
    const tutor = tutors.find(
    (t) =>
        t.tutor_periods &&
        t.tutor_periods.some((tp) => tp.period_id === periodId && tp.id === id)
    );
    return tutor ? tutor.email : "Sin asignar"; // Si no encuentra el tutor, mostrar 'Sin asignar'
  };    
  //////////////////// fin lo necesario para edit ///////  


  // Función para obtener el nombre del topic por su id
  // aux: se usa solo para preferencias, no es problema que use topics
  const getTopicNameById = (id) => {
    const topic = topics.find((t) => t.id === id);
    return topic ? topic.name : ""; // Si no encuentra el topic, mostrar 'Desconocido'
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

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <CircularProgress />
      </Box>
    );

  ///// Opciones de búsqueda y filtrado /////
  const handleShowTeamsWithNoTopic = () => {
    setShowNoTopic(prev => !prev)
  };

  const handleShowTeamsWithNoTutor = () => {
    setShowNoTutor(prev => !prev)
  };
  
  const showTeamsWithNoTopic = (teams) => {
    return showNoTopic ? teams.filter((team) => !team.topic) : teams
  };
  const showTeamsWithNoTutor = (teams) => {
    console.log("--- teams:", teams);
    return showNoTutor ? teams.filter((team) => !team.tutor_period_id) : teams
  };
  // Filtrar equipos según el término de búsqueda Contemplando si se clickeó el botón de showNoTopics
  const filteredTeamsBySearchTerm = data.filter(
    (team) =>
      team?.students?.some(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      getTutorNameById(team?.tutor_period_id, period.id)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) || // Filtrar por tutor
      (team.topic
        ? team.topic.name.toLowerCase().includes(searchTerm.toLowerCase())
        : false) || // Filtrar por tema
      String(team.group_number)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );
  // Obtengo solo los que no tienen topic y/o tutor, o bien conservo lo que ya tenía, según el bool
  const filteredTeams = showTeamsWithNoTopic(showTeamsWithNoTutor(filteredTeamsBySearchTerm));
  console.log("filteredTeams:", filteredTeams);
  // Función para descargar los datos en formato CSV
  const downloadCSV = () => {
    const csvRows = [];
    csvRows.push(
      [
        "Equipo número",
        "Nombre",
        "Apellido",
        "Email",
        "Padrón",
        "Tutor",
        "Tema asignado",
        "Preferencia 1",
        "Preferencia 2",
        "Preferencia 3",
      ].join(",")
    );    

    filteredTeams.forEach((team) => {
      team.students?.forEach((student, index) => {
        team.preferred_topics = team.preferred_topics ? team.preferred_topics : [];
        const row = [
          index === 0 ? team.id : "",
          student.name,
          student.last_name,
          student.email,
          student.id,
          index === 0
            ? getTutorNameById(team.tutor_period_id, period.id) ||
              "Sin asignar"
            : "",
          index === 0
            ? team.topic
              ? team.topic.name.replace(/,/g, " ")
              : "Sin asignar"
            : "",
          index === 0
            ? getTopicNameById(team.preferred_topics[0]).replace(/,/g, " ") ||
              ""
            : "",
          index === 0
            ? getTopicNameById(team.preferred_topics[1]).replace(/,/g, " ") ||
              ""
            : "",
          index === 0
            ? getTopicNameById(team.preferred_topics[2]).replace(/,/g, " ") ||
              ""
            : "",
        ].join(",");

        csvRows.push(row);
      });
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "equipos.csv");
    a.click();
    URL.revokeObjectURL(url);
  };

  console.log("--- Desde afuera, allTopics:", allTopics);

  return (
    <Box>
      {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
      ) : (
        <>
          <TextField
            label="Buscar"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Box
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: 2 
            }}
          >
            
            <Button
              variant="contained"
              color="primary"
              onClick={downloadCSV}
              sx={{ marginBottom: 2 }}
            >
              Descargar CSV
            </Button>

            <Button
              variant="outlined"
              color="primary"
              onClick={handleShowTeamsWithNoTopic}
              sx={{ marginBottom: 2 }}
            >
              {showNoTopic ? "Mostrar todos los equipos" : "Mostrar equipos sin tema"}
            </Button>

            <Button
              variant="outlined"
              color="primary"
              onClick={handleShowTeamsWithNoTutor}
              sx={{ marginBottom: 2 }}
            >
              {showNoTutor ? "Mostrar todos los equipos" : "Mostrar equipos sin tutor"}
            </Button>

            <Button variant="outlined" color="primary" 
              onClick={() => setShowExtraColumns(prev => !prev)}
              sx={{ marginBottom: 2 }}>
              {showExtraColumns ? "Ocultar preferencias" : "Mostrar preferencias"}
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table
              stickyHeader
              sx={{ minWidth: 650 }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: (theme) => theme.palette.action.hover }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Equipo número</TableCell>

                  <TableCell sx={{ fontWeight: "bold" }}>Padrón</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Apellido</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>

                  <TableCell sx={{ fontWeight: "bold" }}>Tutor</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Tema asignado</TableCell>

                  <ExpandableCell show={showExtraColumns} isHeader>
                      Preferencia 1
                  </ExpandableCell>
                  <ExpandableCell show={showExtraColumns} isHeader>
                      Preferencia 2
                  </ExpandableCell>
                  <ExpandableCell show={showExtraColumns} isHeader>
                      Preferencia 3
                  </ExpandableCell>                  
                  
                  <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
                  
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredTeams.map((team) => (
                  <React.Fragment key={team.id}>
                    <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                      <TableCell colSpan={12} align="center"></TableCell>
                    </TableRow>
                    {/* Table content */}
                    <TableCell
                      rowSpan={team.students?.length + 1}
                      align="center"
                    >
                      {team.group_number}
                    </TableCell>
                    {team.students?.map((student, index) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.last_name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        
                          {/* index 0 para renderizar esto una vez por fila de equipo (y no una por estudiante) */}
                          {index === 0 && (
                            <TableCell
                              rowSpan={team.students.length}
                              align="center"
                            >
                              {getTutorNameById(
                                team.tutor_period_id,
                                period.id
                              ) || "Sin asignar"}
                            </TableCell>
                          )}
                          {index === 0 && (
                            <TableCell
                              rowSpan={team.students.length}
                              align="center"
                            >
                              {team.topic ? team.topic.name : "Sin asignar"}
                            </TableCell>
                          )}

                          {/* Las tres preferencias */}
                          {index === 0 && (
                            
                            (!team.preferred_topics || (team.preferred_topics.length === 0)) ? (
                            <>
                              <ExpandableCell show={showExtraColumns} rowSpan={team.students.length} align="center">
                                {"N/A"}
                              </ExpandableCell>
                              <ExpandableCell show={showExtraColumns} rowSpan={team.students.length} align="center">
                                {"N/A"}
                              </ExpandableCell>
                              <ExpandableCell show={showExtraColumns} rowSpan={team.students.length} align="center">
                                {"N/A"}
                              </ExpandableCell>
                            </>
                          ) : (
                            <>
                              <ExpandableCell show={showExtraColumns} rowSpan={team.students.length}>
                                {getTopicNameById(
                                  team.preferred_topics[0]
                                ) || ""}
                              </ExpandableCell>

                              <ExpandableCell show={showExtraColumns} rowSpan={team.students.length}>
                                {getTopicNameById(
                                  team.preferred_topics[1]
                                ) || ""}
                              </ExpandableCell>

                              <ExpandableCell show={showExtraColumns} rowSpan={team.students.length}>
                                {getTopicNameById(
                                  team.preferred_topics[2]
                                ) || ""}
                              </ExpandableCell>
                            </>
                          )                            
                          )}
                        
                        {/* Copypasteo desde ParentTable esta sección de los botones, ver [] */}
                        {index === 0 && (
                          <TableCell rowSpan={team.students.length}>
                            <Stack direction="row" spacing={1}>                          
                              <Button
                                onClick={() => {setOpenEditModal(true); setItemToPassToModal(team)}}
                                style={{ backgroundColor: "#e0711d", color: "white" }} //botón naranja
                                >
                                Editar
                              </Button>
                            
                              {false && (
                                <Button
                                  style={{ backgroundColor: "red", color: "white" }}
                                  >
                                  Eliminar
                                </Button>
                              )}
                            </Stack>
                          </TableCell>
                        )}

                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TeamModal 
            openEditModal={openEditModal}
            setOpenEditModal={setOpenEditModal}
            
            handleEditItem={handleEditItem}
            originalEditedItemId={originalEditedItemId}
            setOriginalEditedItemId={setOriginalEditedItemId}
            item={itemToPassToModal}
            setParentItem={setItemToPassToModal}

            openConfirmModal={openConfirmEditModal}
            setOpenConfirmModal={setOpenConfirmEditModal}
            handleConfirm={handleConfirmEditOnConflict}

            conflictMsg={conflictsMessage}
            setConflictMsg={setConflictsMessage}

            //topics={allTopics}
            topics={constAllTopics}            
            tutors={tutors}
            students={students}
            periodId={period.id}
          />  
          <MySnackbar
            open={notification.open}
            handleClose={handleSnackbarClose}
            message={notification.message}
            status={notification.status}
          />
        </>
      )}

    </Box>
  )
};

export default GroupDataTable;
