/// Este archivo es similar a ParentTable, pero tanto el contenido de la tabla que se renderiza como
// el flujo de editar equipo (con dos modales, analizando si hubo o no conflicto) es diferente a ParentTable,
// por lo que se optó por mantener los archivos separados en pos de la legibilidad.
import {
  Container,
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
  Fab,
  Box,
  Stack
} from "@mui/material";
import { styled } from "@mui/system";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ExpandableCell from "../ExpandableCell";

import { TeamModals } from "../UI/Tables/Modals/teamModals";
import { setGroups } from "../../redux/slices/groupsSlice";
import { editTeam, addTeam } from "../../api/sendGroupForm";
import MySnackbar from "../UI/MySnackBar";
import { getTableData } from "../../api/handleTableData";
import AddIcon from "@mui/icons-material/Add";
import { TitleSpaced } from "../../styles/Titles";

// Componente para la tabla de equipos
const TeamDataTable = ({
  endpoint,
  items,
  title,
  enableEdit = true,
  enableDelete = true, // No existe endpoint delete para teams actualmente
  enableAdd = true,
  enableFilterButtons = true,
}) => {
  const period = useSelector((state) => state.period);

  // Obtener la lista de topics desde Redux
  const topics = Object.values(useSelector((state) => state.topics))
    .map(({ version, rehydrated, ...rest }) => rest)
    .filter((item) => Object.keys(item).length > 0);

  const tutors = Object.values(useSelector((state) => state.tutors))
    .map(({ version, rehydrated, ...rest }) => rest)
    .filter((item) => Object.keys(item).length > 0);

  const students = Object.values(useSelector((state) => state.students))
  .map(({ version, rehydrated, ...rest }) => rest)
  .filter(item => Object.keys(item).length > 0);

  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  const [allTopics, setAllTopics] = useState({csvTopics: topics, customTopics: []});
  
  // Valor inicial lo recibido por props
  const [data, setData] = useState(items); // data es la lista de teams a mostrar en la tabla

  const [showExtraColumns, setShowExtraColumns] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [showNoTopic, setShowNoTopic] = useState(false);
  const [showNoTutor, setShowNoTutor] = useState(false);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [conflicts, setConflicts] = useState({msg:[]});

  const [openEditModal, setOpenEditModal] = useState(false);
  const [itemToPassToModal, setItemToPassToModal] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);

  // Estilos
  const Root = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(4),
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#ffffff",
    boxShadow: theme.shadows[3],
  }));
  
  const Title = TitleSpaced;

  // useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Si hay endpoint, hacemos request y actualizamos
        if (endpoint) {
          const responseData = await getTableData(endpoint, user); // TEAMS
          setData(responseData);
        }

        // Minor 'fix' xq admin envía tema copypasteado en csv (con != tutor) queda id repetido y eso rompe búsqueda de Autocomplete
        const uniqueTopics = Array.from(
          new Map((topics ?? []).map(t => [t.id, t])).values()
        );
        // Workaround a que el back no los devuelva: temas de "Ya tengo tema y tutor":
        const customTopics = data?.filter(team => !topics.some(t => t.id === team.topic?.id))
        .map(team => team.topic);
        setAllTopics({csvTopics: uniqueTopics, customTopics: customTopics});        

        setLoading(false);

      } catch (error) {
        console.error("Error fetching teams data:", error);
        setLoading(false); // Handle error
      }
    };

    fetchData();
  }, [endpoint, user]);
  //}, [endpoint, user, groups, topics]);

  // Agregar equipo. El first modal es en este caso el modal de add.
  // Es llamada desde TeamModals: primera vez queda bool en false; luego, si hay conflictos, con bool en true.
  const handleAddItem = async (newItem, setNewItem, handleCloseFirstModal=undefined, confirm_option=false, confirm_topic_move=false) => {
    try {
      await addItemToGenericTable(addTeam, newItem, setNewItem, {}, confirm_option, confirm_topic_move);
      if (handleCloseFirstModal) {
        handleCloseFirstModal(); // Esto cierra el primer modal solo si no hubo conflicto
      }      
      setNewItem({students:[]}); // necesario para el segundo modal, el de confirm.// <-- copypasteo esto acá, revisar en el modal
    } catch (err) {
      console.error(`Error when adding new team:`, err);
      setNotification({
        open: true,
        //message: `Error al agregar ${TableTypeSingularLabel[title]||''}.`,        
        message: `Error al agregar equipo.`,
        status: "error",
      });

      // Si hay conflicto, no cerrar el modal de add; abrir cartel de confirmación
      // y si se confirma, se reenvía la request (conservar los datos a enviar) pero con un bool en true
      if (err.response?.status===409) {
        setNotification({
          open: true,
          message: `Advertencia: Conflicto al agregar equipo.`,
          status: "warning",
        });

        // Indicamos que los conflictos fueron durante el add de un equipo, y abrimos el modal de confirmación
        setConflicts({operation: "add", msg: err.response?.data?.detail} || {operation: "add", msg:[]});
        setOpenConfirmModal(true);
      }
    }
  };
  const addItemToGenericTable = async (apiAddFunction, newItem, setNewItem, setReducer, confirm_option=false, confirm_topic_move=false) => {    
    newItem.tutor_email = getTutorEmailByTutorPeriodId(newItem.tutor_period_id, period.id);
    const changes = await apiAddFunction(newItem, user, period.id, confirm_option); // add
    setNewItem({});
    setNotification({
      open: true,
      //message: `Se agregó ${TableTypeSingularLabel[title]||''} exitosamente`, // 'estudiante', etc
      message: `Se agregó equipo exitosamente`, // 'estudiante', etc
      status: "success",
    });

    setData((prevData) => adaptListWithApiResponse(prevData, changes));
    //dispatch(setReducer((prevData) => [...prevData, item])); // set
  };

  // Editar equipo. El first modal es en este caso el modal de editar.
  // Es llamada desde TeamModals: primera vez queda bool en false; luego, si hay conflictos, con bool en true.
  const handleEditItem = async (editedItem, setEditedItem, handleCloseFirstModal=undefined, confirm_option=false, confirm_topic_move=false) => {
    try {
      editedItem.tutor_email = getTutorEmailByTutorPeriodId(editedItem.tutor_period_id, period.id);
      await editItemInGenericTable(editTeam, editedItem, setEditedItem, setGroups, confirm_option, confirm_topic_move);
      
      // Close modal de edición en caso de éxito sin conflictos
      if (handleCloseFirstModal) {
        handleCloseFirstModal(); // esto cierra el primer modal (edit en este caso) si no hay conflictos
      }
      setEditedItem({}); // necesario para el segundo modal, el de confirm.
      
    } catch (err) {      
      const title="team";
      console.error(`Error when editing ${title}:`, err);
      setNotification({
        open: true,
        message: `Error al editar equipo.`,
        status: "error",
      });

      // Si hay conflicto, no cerrar el modal de edición; abrir cartel de confirmación
      // y si se confirma, se reenvía la request (conservar los datos a enviar) pero con un bool en true
      if (err.response?.status===409) {
        setNotification({
          open: true,
          message: `Advertencia: Conflicto al editar equipo.`,
          status: "warning",
        });
        
        setConflicts({operation: "edit", msg: err.response?.data?.detail} || {operation: "edit", msg:[]});
        setOpenConfirmModal(true);
      }
    }
  };
  const editItemInGenericTable = async (apiEditFunction, editedItem, setEditedItem, setReducer, confirm_option=false, confirm_topic_move=false) => {    
    const changes = await apiEditFunction(editedItem.id, period.id, editedItem, user, confirm_option, confirm_topic_move);
    setNotification({
      open: true,
      message: `Se editó equipo exitosamente`,
      status: "success",
    });
    // Si es éxito, hay que adaptar los datos de la lista a mostrar en la tabla    
    setData((prevData) => adaptListWithApiResponse(prevData, changes));
  };
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });
  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  // Adaptar la lista de equipos que se muestra en la tabla, con el resultado del add/edición
  const adaptListWithApiResponse = (prevData, changes) => {
    let updated = [...prevData];

    // Agregar si hay equipo nuevo
    if (changes.added){
      updated.push(...changes.added); // "extend" versión javascript
    }

    // Reemplazar o agregar los equipos editados
    changes.edited?.forEach((team) => {
      const idx = updated.findIndex((prevDataTeam) => prevDataTeam.id === team.id);
      if (idx >= 0) {
        // reenplazar si ya existía
        updated[idx] = team;
      } else {
        // o agregar si no estaba en la lista (no debería darse este caso en un edit en realidad)
        updated.push(team);
      }
    });

    // Eliminar equipos borrados (me quedo con los equipos que No incluye la lista de deleted)
    // (obs: el campo deleted existe siempre, es vacío si no se eliminó nada)
    updated = updated.filter((prevDataTeam) => !changes.deleted.includes(prevDataTeam.id));

    return updated;
  }
  
  // Formato para el endpoint
  const getTutorEmailByTutorPeriodId = (id, periodId) => {
    const tutor = tutors.find(
    (t) =>
        t.tutor_periods &&
        t.tutor_periods.some((tp) => tp.period_id === periodId && tp.id === id)
    );
    return tutor ? tutor.email : "Sin asignar"; // Si no encuentra el tutor, mostrar 'Sin asignar'
  };

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
    return showNoTutor ? teams.filter((team) => !team.tutor_period_id) : teams
  };
  // Filtrar equipos según el término de búsqueda
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
  // Contemplo si se clickeó botones de showNoX: obtengo solo los que no tienen topic y/o tutor, o bien conservo lo que ya tenía, según el bool
  const filteredTeams = showTeamsWithNoTopic(showTeamsWithNoTutor(filteredTeamsBySearchTerm));
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

  const copyEmailsToClipboard = async () => {

    try {
      const displayedEmails = filteredTeams
      .flatMap(team => team.students.map(student => student.email)) // dentro del paréntesis hay un array de emails por equipo => flatmap
      .filter(Boolean); // el filter elimina undefined/null
      console.log("--- displayedEmails:", displayedEmails);

      await navigator.clipboard.writeText(displayedEmails.join(", "));
      setNotification({
        open: true,
        message: `Copiado al portapapeles`,
        status: "success",
      });
      // Con esto logramos que el alert no aparezca antes que la notif (pasa, sin timeout, por funcionamiento de react)
      setTimeout(() => {
        alert("Emails copiados!");
      }, 0);


    } catch (err) {
      console.error("Error al copiar al portapapeles:", err);
      setNotification({
        open: true,
        message: `Error al copiar al portapapeles`,
        status: "error",
      });
    }
  };

  return (
      <>
        <Container maxWidth={false} sx={{ maxWidth: "1350px" }}>
          <Root>
            <Title variant="h4">{title}</Title>
            <TextField
              label="Buscar"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            
            {/* Botones */}
            <Box            
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                gap: 2,
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
                onClick={copyEmailsToClipboard}
                sx={{ ml: "auto" }} // ml empuja hacia la derecha (al gap lo maneja el último de la derecha o el box)
              >
                Copiar emails al portapapeles
              </Button>              

              {enableAdd && (
                <Fab
                  size="small"
                  color="primary"
                  aria-label="add"                  
                  onClick={() => setOpenAddModal(true)}
                >
                  <AddIcon />
                </Fab>
              )}
            </Box>
            
            {/* Segunda fila de botones */}
            <Box
              sx={{ 
                display: 'flex', 
                justifyContent: 'right', 
                gap: 2,
                ml: 5,
                mb: 2
              }}
            >
              {enableFilterButtons && (
                <>
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
                </>
              )}
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
                    
                    {enableEdit && (
                      <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
                    )}
                    
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
                          
                          {/* Sección de los botones */}
                          {index === 0 && (
                            <TableCell rowSpan={team.students.length}>
                              <Stack direction="row" spacing={1}>                          
                                {enableEdit && (
                                  <Button
                                  onClick={() => {setOpenEditModal(true); setItemToPassToModal(team)}}
                                  style={{ backgroundColor: "#e0711d", color: "white" }} //botón naranja
                                  >
                                  Editar
                                </Button>
                                )}
                              
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
          </Root>
        </Container>

        <TeamModals
          openAddModal={openAddModal}
          setOpenAddModal={setOpenAddModal}
          handleAddItem={handleAddItem}

          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}            
          handleEditItem={handleEditItem}
          
          item={itemToPassToModal}
          setParentItem={setItemToPassToModal}

          openConfirmModal={openConfirmModal}
          setOpenConfirmModal={setOpenConfirmModal}

          conflicts={conflicts}
          setConflictMsg={setConflicts}

          topics={allTopics}
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
  )
};

export default TeamDataTable;
