import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Box,
  CircularProgress,
  Fab,
  Stack
} from "@mui/material";
import { styled } from "@mui/system";
import { getTableData, deleteRow } from "../../../api/handleTableData";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { addStudent, editStudent } from "../../../api/handleStudents";
import MySnackbar from "../MySnackBar";
import { setStudents } from "../../../redux/slices/studentsSlice";
import { addTutor, editTutor } from "../../../api/handleTutors";
import { setTutors } from "../../../redux/slices/tutorsSlice";
import { getCategories } from "../../../utils/getCategories";
import { addTopic, editTopic } from "../../../api/handleTopics";
import { setTopics } from "../../../redux/slices/topicsSlice";
import { TableType, TableTypeSingularLabel } from "./TableType";
import { StudentModals } from "./Modals/studentModals";
import { TutorModals } from "./Modals/tutorModals";
import { TopicModals } from "./Modals/topicModals";
import { addCapacityToTutors } from "../../../utils/addCapacityToTutors";
import { DeleteConfirmationModal } from "./Modals/deleteConfirmationModal";

const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#ffffff",
  boxShadow: theme.shadows[3],
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: "#0072C6",
  textAlign: "center",
  fontSize: "2rem",
  fontWeight: "bold",
}));

const ParentTable = ({
  title,
  columns,
  rowKeys,
  endpoint,
  renderRow,
  items,
  csvColumns,
  csvRowKeys,
  enableEdit = true,
  enableDelete = true,
  enableAdd = true,
}) => {
  // Data es la lista de elementos (estudiantes / tutores / temas / respuestas) a mostrar en la tabla
  // Seteamos items para usar eso como valor inicial antes de hacer fetch
  const [data, setData] = useState(items);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [originalEditedItemId, setOriginalEditedItemId] = useState(null);
  const [itemToPassToModal, setItemToPassToModal] = useState(null);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);

  const period = useSelector((state) => state.period);
  const user = useSelector((state) => state.user);
  const tutorsWithoutCapacityField = Object.values(useSelector((state) => state.tutors))
  .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
  .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos
  const tutors = addCapacityToTutors(tutorsWithoutCapacityField, period);  

  csvRowKeys = csvRowKeys || rowKeys;
  csvColumns = csvColumns || columns;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Si sí hay endpoint, actualizamos la data
        if (endpoint) {
          const responseData = await getTableData(endpoint, user);

          if (title === TableType.TUTORS){
            const tutorsWithCapacityField = addCapacityToTutors(responseData, period);
            setData(tutorsWithCapacityField);
          } else {
            setData(responseData);
          }          
        }
        
        setLoading(false);

      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Handle error
      }
    };

    fetchData();
  }, [endpoint, user]);

  // Campo capacity de tutores
  useEffect(() => {
    const addTutorCapacityField = () => {      
      if (title === TableType.TUTORS) {
        if (!data) {
          // Seteo inicial, con campo capacity
          // Así que agrego capacity a 'items'
          const tutorsWithCapacityField = addCapacityToTutors(items, period);
          setData(tutorsWithCapacityField);
          
        } else {
          // Agrego capacity a lo que ya tenía 'data'
          const tutorsWithCapacityField = addCapacityToTutors(data, period);
          setData(tutorsWithCapacityField);
        }
      }
    };
    addTutorCapacityField();
  }, [openEditModal, openAddModal]); //endpoint

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  const unnestKeys = (obj, parentKey = "", result = {}) => {
    for (const [key, value] of Object.entries(obj)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        unnestKeys(value, newKey, result);
      } else {
        result[newKey] = value;
      }
    }

    return result;
  };
  
  const dispatch = useDispatch();

  const addItemToGenericTable = async (apiAddFunction, newItem, setNewItem, setReducer) => {
    const item = await apiAddFunction(newItem, user, period.id); // add
    setNewItem({});
    setNotification({
      open: true,
      message: `Se agregó ${TableTypeSingularLabel[title]||''} exitosamente`, // 'estudiante', etc
      status: "success",
    });
    setData((prevData) => [...prevData, item]);
    dispatch(setReducer((prevData) => [...prevData, item])); // set

  };
  const handleAddItem = async (newItem, setNewItem, handleCloseAddModal) => {
    try {
      if (title === TableType.STUDENTS) {
        await addItemToGenericTable(addStudent, newItem, setNewItem, setStudents);
      } else if (title === TableType.TUTORS) {
        await addItemToGenericTable(addTutor, newItem, setNewItem, setTutors);
      } else if (title === TableType.TOPICS) {
        await addItemToGenericTable(addTopic, newItem, setNewItem, setTopics);
      }
    } catch (err) {
      console.error(`Error when adding new ${title}:`, err);
      setNotification({
        open: true,
        message: `Error al agregar ${TableTypeSingularLabel[title]||''}`,
        status: "error",
      });
    } finally {
      handleCloseAddModal(true);
    }
  };

  const editItemInGenericTable = async (apiEditFunction, editedItem, setEditedItem, setReducer) => {    
    const item = await apiEditFunction(originalEditedItemId, period.id, editedItem, user);
    setEditedItem({});
    setOriginalEditedItemId(null);
    setNotification({
      open: true,
      message: `Se editó ${TableTypeSingularLabel[title]||''} exitosamente`,
      status: "success",
    });
    setData((prevData) =>
      prevData.map((existingItem) => (existingItem.id === originalEditedItemId ? item : existingItem))
    );
    dispatch(setReducer((prevData) =>
      prevData.map((existingItem) => (existingItem.id === originalEditedItemId ? item : existingItem)))
    );
  };

  const handleEditItem = async (editedItem, setEditedItem, handleCloseEditModal) => {
    try {
      if (title === TableType.STUDENTS) {
        await editItemInGenericTable(editStudent, editedItem, setEditedItem, setStudents);
      } else if (title === TableType.TUTORS) {
        await editItemInGenericTable(editTutor, editedItem, setEditedItem, setTutors);       
      } else if (title === TableType.TOPICS) {
        await editItemInGenericTable(editTopic, editedItem, setEditedItem, setTopics);
      }
    } catch (err) {
      console.error(`Error when editing ${title}:`, err);
      setNotification({
        open: true,
        message: `Error al editar ${TableTypeSingularLabel[title]||''}`,
        status: "error",
      });
    } finally {
      handleCloseEditModal(true);
    }
    
  };

  const handleDeleteItem = async (id, handleClose) => {
    try {
      // Call deleteResponse to remove the record
      await deleteRow(endpoint, id, user);
      // Filter the data state to remove the deleted item
      setData((prevData) => prevData.filter((item) => item.id !== id));
      setNotification({
        open: true,
        message: `Se eliminó ${TableTypeSingularLabel[title]||''} exitosamente`,
        status: "success",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      setNotification({
        open: true,
        message: `Error al eliminar ${TableTypeSingularLabel[title]||''}`,
        status: "error",
      });
    } finally {
      handleClose();
    }
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const downloadCSV = () => {
    const csvRows = [];

    // Headers
    csvRows.push(csvColumns.join(","));

    // Data
    data.forEach((item) => {
      const unnestedItem = unnestKeys(item);
      const row = csvColumns
        .map((column) => {
          const value = unnestedItem[csvRowKeys[column]]; // Obtener el valor
          // Verificar si el valor es un array
          if (Array.isArray(value)) {
            return value.join(" || ").replace(/,/g, " "); // Unir los elementos del array usando ';'
          }
          return String(value).replace(/,/g, " ");
        })
        .join(",");
      csvRows.push(row);
    });

    // Crear un blob y descargar
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("href", url);
  
    a.setAttribute(
      "download",
      title.toLowerCase().replace(" ", "_").concat(".csv")
    );
    a.click();
  
    URL.revokeObjectURL(url);
  }

  // Filtrado mejorado
  const filteredData = data.filter((item) => {
    return csvColumns.some((column) => {
      const unnestedItem = unnestKeys(item);
      const itemValue = unnestedItem[csvRowKeys[column]] || ""; // Utiliza el mapeo
      return String(itemValue).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  if (loading) return <Typography variant="h6">Cargando...</Typography>;
  const categories = title === TableType.TOPICS ? getCategories(data) : []; // debe ser sobre "data" y no otra variable.    

  const copyEmailsToClipboard = async () => {
    // Solo seguir para estas dos (y embedded), que son las que tienen campo email    
    if (title !== TableType.STUDENTS && title!== TableType.TUTORS && !TableType.EMBEDDEDNOTITLE) return;

    try {
      const displayedEmails = filteredData.map(item => item.email).filter(Boolean); // el filter elimina undefined/null
      //console.log("--- displayedEmails:", displayedEmails);

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
      <Container maxWidth="lg">
        <Root>
          {/* --- Header --- */}
          { title !== TableType.EMBEDDEDNOTITLE && (<Title variant="h4">{title}</Title>)}
          <TextField
            label="Buscar"
            variant="outlined"            
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            style={{ marginBottom: "20px" }}
          />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={2}
          >
            <Button variant="contained" color="primary" onClick={downloadCSV}>
              Descargar como CSV
            </Button>
            
            <Button
              variant="outlined"
              color="primary"
              onClick={copyEmailsToClipboard}
              sx={{ ml: "auto" }} // ml empuja hacia la derecha (al gap lo maneja el último de la derecha)
            >
              Copiar emails al portapapeles
            </Button>
            
            {title !== TableType.RESPONSES && enableAdd && (
              <Box>
                <Fab
                  size="small"
                  color="primary"
                  aria-label="add"                  
                  onClick={() => setOpenAddModal(true)}
                  sx={{ ml: 5 }} // ml ajusta el espacio al siguiente de su izquierda
                >
                  <AddIcon />
                </Fab>
              </Box>
            )}
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell key={index}>{column}</TableCell>
                  ))}
                  {(enableEdit || enableDelete) &&
                    <TableCell>Acciones</TableCell>
                  }
                </TableRow>
              </TableHead>
              {/* --- Content --- */}
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    {renderRow(item, rowKeys)}
                    {(enableEdit || enableDelete) && <TableCell>
                      <Stack direction="row" spacing={1}>
                        {enableEdit && (
                          <Button
                            onClick={() => {setOpenEditModal(true); setItemToPassToModal(item)}}
                            style={{ backgroundColor: "#e0711d", color: "white" }} //botón naranja
                            >
                            Editar
                          </Button>
                        )}
                        {enableDelete && (
                          <Button
                            onClick={() => {setOpenConfirmDeleteModal(true); setItemToPassToModal(item)}}
                            style={{ backgroundColor: "red", color: "white" }}
                            >
                            Eliminar
                          </Button>
                        )}                        
                      </Stack>
                    </TableCell> }                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Root>
      </Container>
      {title === TableType.STUDENTS &&
       <StudentModals 
          openAddModal={openAddModal}
          openEditModal={openEditModal}
          setOpenAddModal={setOpenAddModal}
          setOpenEditModal={setOpenEditModal}
          handleAddItem={handleAddItem}
          handleEditItem={handleEditItem}
          originalEditedItemId={originalEditedItemId}
          setOriginalEditedItemId={setOriginalEditedItemId}
          item={itemToPassToModal}
          setParentItem={setItemToPassToModal}
       />

      }; 
      {title === TableType.TUTORS &&
        <TutorModals 
          openAddModal={openAddModal}
          openEditModal={openEditModal}
          setOpenAddModal={setOpenAddModal}
          setOpenEditModal={setOpenEditModal}
          handleAddItem={handleAddItem}
          handleEditItem={handleEditItem}
          originalEditedItemId={originalEditedItemId}
          setOriginalEditedItemId={setOriginalEditedItemId}
          item={itemToPassToModal}
          setParentItem={setItemToPassToModal}
        />
        
      };
      {title === TableType.TOPICS &&
        <TopicModals 
          openAddModal={openAddModal}
          openEditModal={openEditModal}
          setOpenAddModal={setOpenAddModal}
          setOpenEditModal={setOpenEditModal}
          handleAddItem={handleAddItem}
          handleEditItem={handleEditItem}
          originalEditedItemId={originalEditedItemId}
          setOriginalEditedItemId={setOriginalEditedItemId}
          item={itemToPassToModal}
          setParentItem={setItemToPassToModal}
          tutors={tutors}
          categories={categories}
        />
      };      
      <DeleteConfirmationModal
        openModal={openConfirmDeleteModal}
        setOpenModal={setOpenConfirmDeleteModal}
        handleDelete={handleDeleteItem}
        item={itemToPassToModal}
        setParentItem={setItemToPassToModal}
        itemTypeName={TableTypeSingularLabel[title]||''}
      />      
      <MySnackbar
        open={notification.open}
        handleClose={handleSnackbarClose}
        message={notification.message}
        status={notification.status}
      />
    </>
  );
};

export default ParentTable;