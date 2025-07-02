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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  Stack
} from "@mui/material";
import { styled } from "@mui/system";
import { getTableData, deleteRow } from "../../../api/handleTableData";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { NumericFormat } from "react-number-format";
import { addStudent, editStudent } from "../../../api/handleStudents";
import MySnackbar from "../MySnackBar";
import { setStudents } from "../../../redux/slices/studentsSlice";
import { addTutor, editTutor } from "../../../api/handleTutors";
import { setTutors } from "../../../redux/slices/tutorsSlice";
import { getCategories } from "../../../utils/getCategories";
import { addTopic } from "../../../api/handleTopics";
import { setTopics } from "../../../redux/slices/topicsSlice";
import { TableType } from "./TableType";

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
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [editedItem, setEditedItem] = useState({}); // data
  const [originalEditedItemId, setOriginalEditedItemId] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const handleClickOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setNewItem({})
    setOpenAddModal(false);
  };

  const handleClickOpenEditModal = (item) => {
    // Si lo que se está editando es Tutor, es necesario extraer su capacity existente de un
    // campo especial algo estrambótico (item tiene lista de tutor_periods, cada uno con
    // un period_id y una capacity). (Sin esto ítem no tiene capacity y falla la request).
    if (title=TableType.TUTORS) {
      const selectedTutorPeriod = item.tutor_periods.find(tp => tp.period_id === period.id);
      const capacity = selectedTutorPeriod ? selectedTutorPeriod.capacity : null;
      item["capacity"]=capacity;
    }
    // El id puede cambiar, así que guardamos el id original
    setOriginalEditedItemId(item.id);
    setEditedItem(item);
    setOpenEditModal(true);    
  };

  const handleCloseEditModal = () => {
    setEditedItem({})
    setOpenEditModal(false);
  };

  const user = useSelector((state) => state.user);
  const tutors = Object.values(useSelector((state) => state.tutors))
  .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
  .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await getTableData(endpoint, user);
        setData(responseData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Handle error
      }
    };

    fetchData();
  }, [endpoint, user]);

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
  const period = useSelector((state) => state.period);
  const dispatch = useDispatch();

  const handleAddItem = async () => {
    try {
      if (title === TableType.STUDENTS) {
        const item = await addStudent(newItem, user, period.id);
        setNewItem({});
        setNotification({
          open: true,
          message: `Alumno agregado éxitosamente`,
          status: "success",
        });
        setData([...items, item]);
        dispatch(setStudents([...items, item]));
      } else if (title === TableType.TUTORS) {
        const item = await addTutor(newItem, user, period.id);
        setNewItem({});
        setNotification({
          open: true,
          message: `Tutor agregado éxitosamente`,
          status: "success",
        });
        setData([...items, item]);
        dispatch(setTutors([...items, item]));
      } else if (title === TableType.TOPICS) {
        const item = await addTopic(newItem, user, period.id);
        setNewItem({});
        setNotification({
          open: true,
          message: `Tema agregado éxitosamente`,
          status: "success",
        });
        setData([...items, item]);
        dispatch(setTopics([...items, item]));
      }
    } catch (err) {
      console.error(`Error when adding new ${title}:`, err);
      setNotification({
        open: true,
        message: `Error al agregar ${title.toLowerCase()}. Por favor, vuelva a intentar más tarde.`,
        status: "error",
      });
    } finally {
      handleCloseAddModal(true);
    }
  };

  const handleEdit = async () => {
    try {
      if (title === TableType.STUDENTS) {
        const item = await editStudent(originalEditedItemId, period.id, editedItem, user);
        setEditedItem({});
        setOriginalEditedItemId(null);
        setNotification({
          open: true,
          message: `Alumno editado exitosamente`,
          status: "success",
        });
        setData((prevData) =>
          prevData.map((existingItem) => (existingItem.id === item.id ? item : existingItem))
        );
        dispatch(setStudents((prevData) =>
          prevData.map((existingItem) => (existingItem.id === item.id ? item : existingItem)))
        );
      } else if (title === TableType.TUTORS) {
        const item = await editTutor(originalEditedItemId, period.id, editedItem, user);
        setEditedItem({});
        setOriginalEditedItemId(null);
        setNotification({
          open: true,
          message: `Tutor editado exitosamente`,
          status: "success",
        });
        setData((prevData) =>
          prevData.map((existingItem) => (existingItem.id === item.id ? item : existingItem))
        );
        dispatch(setStudents((prevData) =>
          prevData.map((existingItem) => (existingItem.id === item.id ? item : existingItem)))
        );
      }
      // Esto de acá abajo que está comentado es copypaste del add, lo modificaré después []
      /* else if (title === TableType.TOPICS) {
        const item = await addTopic(newItem, user, period.id);
        setNewItem({});
        setNotification({
          open: true,
          message: `Tema editado exitosamente`,
          status: "success",
        });
        setData([...items, item]);
        dispatch(setTopics([...items, item]));
      }*/
    } catch (err) {
      console.error(`Error when editing new ${title}:`, err);
      setNotification({
        open: true,
        message: `Error al editar ${title.toLowerCase()}. Por favor, vuelva a intentar más tarde.`,
        status: "error",
      });
    } finally {
      handleCloseEditModal(true);
    }
    
  };

  const handleDelete = async (id) => {
    try {
      // Call deleteResponse to remove the record
      await deleteRow(endpoint, id, user);
      // Filter the data state to remove the deleted item
      setData((prevData) => prevData.filter((item) => item.id !== id));
      setNotification({
        open: true,
        message: `Eliminado con exito!`,
        status: "success",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
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
    csvRows.push(columns.join(","));

    // Data
    data.forEach((item) => {
      const unnestedItem = unnestKeys(item);
      const row = columns
        .map((column) => {
          const value = unnestedItem[rowKeys[column]]; // Obtener el valor

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
  };

  // Filtrado mejorado
  const filteredData = data.filter((item) => {
    return columns.some((column) => {
      const unnestedItem = unnestKeys(item);
      const itemValue = unnestedItem[rowKeys[column]] || ""; // Utiliza el mapeo
      return String(itemValue).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const addStudentModal = () => {
    return innerActionStudentModal(openAddModal, handleCloseAddModal, handleAddItem, newItem, setNewItem, "Agregar", "Agregar")
  }

  const editStudentModal = () => {
    return innerActionStudentModal(openEditModal, handleCloseEditModal, handleEdit, editedItem, setEditedItem, "Editar", "Guardar")
  }

  const innerActionStudentModal = (bool, handleCloseModal, handleConfirmAction, item, setItem, TitleText, ConfirmButtonText) => {    
    return (
      <Dialog open={bool} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            backgroundColor: "#f5f5f5",
            color: "#333",
            padding: "16px 24px",
          }}
        >
          {TitleText} Alumno
        </DialogTitle>
        <DialogContent dividers sx={{ padding: "24px 24px 16px" }}>
          <NumericFormat
            fullWidth
            allowNegative={false}
            customInput={TextField}
            variant="outlined"
            autoFocus
            margin="normal"
            label="Padrón"
            value={item["id"] || ""}
            required
            onChange={(e) =>
              setItem({ ...item, id: parseInt(e.target.value) })
            }
          />
          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            label="Nombre"
            value={item["name"] || ""}
            required
            onChange={(e) => setItem({ ...item, name: e.target.value })}
          />
          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            label="Apellido"
            value={item["last_name"] || ""}
            required
            onChange={(e) =>
              setItem({ ...item, last_name: e.target.value })
            }
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={item["email"] || ""}
            onChange={(e) =>
              setItem({ ...item, email: e.target.value })
            }
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="outlined" color="error">
            Cancelar
          </Button>
          <Button onClick={handleConfirmAction} variant="contained" color="primary">
            {ConfirmButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    )
  };

  const addTutorModal = () => {
    return innerActionTutorModal(openAddModal, handleCloseAddModal, handleAddItem, newItem, setNewItem, "Agregar Nuevo", "Agregar")
  };

  const editTutorModal = () => {
    return innerActionTutorModal(openEditModal, handleCloseEditModal, handleEdit, editedItem, setEditedItem, "Editar", "Guardar")
  };

  const innerActionTutorModal = (bool, handleCloseModal, handleConfirmAction, item, setItem, TitleText, ConfirmButtonText) => {
    return (
      <Dialog open={bool} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            backgroundColor: "#f5f5f5",
            color: "#333",
            padding: "16px 24px",
          }}
        >
          {TitleText} Tutor
        </DialogTitle>
        <DialogContent dividers sx={{ padding: "24px 24px 16px" }}>
          <NumericFormat
            fullWidth
            allowNegative={false}
            customInput={TextField}
            variant="outlined"
            autoFocus
            margin="normal"
            label="DNI o Identificación"
            value={item["id"] || ""}
            required
            onChange={(e) =>
              setItem({ ...item, id: parseInt(e.target.value) })
            }
          />
          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            label="Nombre"
            value={item["name"] || ""}
            required
            onChange={(e) => setItem({ ...item, name: e.target.value })}
          />
          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            label="Apellido"
            value={item["last_name"] || ""}
            required
            onChange={(e) =>
              setItem({ ...item, last_name: e.target.value })
            }
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={item["email"] || ""}
            onChange={(e) =>
              setItem({ ...item, email: e.target.value })
            }
            required
          />
          <NumericFormat
            fullWidth
            allowNegative={false}
            customInput={TextField}
            variant="outlined"
            margin="normal"
            label="Capacidad"
            value={item["capacity"] || ""}
            required
            onChange={(e) =>
              setItem({ ...item, capacity: parseInt(e.target.value) })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="outlined" color="error">
            Cancelar
          </Button>
          <Button onClick={handleConfirmAction} variant="contained" color="primary">
            {ConfirmButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    )
  };

  const addTopicModal = () => {
    return (
      <Dialog open={openAddModal} onClose={handleCloseAddModal} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            backgroundColor: "#f5f5f5",
            color: "#333",
            padding: "16px 24px",
          }}
        >
          Agregar Nuevo Tema
        </DialogTitle>
        <DialogContent dividers sx={{ padding: "24px 24px 16px" }}>
          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            label="Titulo"
            value={newItem["name"] || ""}
            required
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <InputLabel>Seleccionar categoria</InputLabel>
          <Select
            value={
              newItem["category"] || ""
            }
            label="Categorías"
            onChange={(e) =>
              setNewItem({ ...newItem, category: e.target.value })
            }
            margin="normal"

            sx={{ marginBottom: "8px" }}
            required
            fullWidth
          >
            <MenuItem key="" value="" disabled>
              Seleccionar categoria
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
          <InputLabel margin="normal">Seleccionar tutor</InputLabel>
          <Select
            margin="normal"
            value={
              newItem["tutor_email"] || ""
            }
            label="Email del tutor"
            onChange={(e) =>
              setNewItem({ ...newItem, tutor_email: e.target.value })
            }
            required
            fullWidth
          >
            <MenuItem key="" value="" disabled>
              Seleccionar tutor
            </MenuItem>
            {tutors.map((tutor) => (
              <MenuItem key={tutor.id} value={tutor.email}>
                {tutor.email}
              </MenuItem>
            ))}
          </Select>
          <NumericFormat
            fullWidth
            allowNegative={false}
            customInput={TextField}
            variant="outlined"
            margin="normal"
            label="Capacidad"
            value={newItem["capacity"] || ""}
            required
            onChange={(e) =>
              setNewItem({ ...newItem, capacity: parseInt(e.target.value) })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddModal} variant="outlined" color="error">
            Cancelar
          </Button>
          <Button onClick={handleAddItem} variant="contained" color="primary">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    )
  };

  if (loading) return <Typography variant="h6">Cargando...</Typography>;
  const categories = title === TableType.TOPICS ? getCategories(items) : [];
  return (
    <>
      <Container maxWidth="lg">
        <Root>
          {/* --- Header --- */}
          <Title variant="h4">{title}</Title>
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
            {/* {(AddButtonComponent && topicsCond) && <AddButtonComponent />} */}

            {title !== "Respuestas" && (
              <Box>
                <Fab
                  size="small"
                  color="primary"
                  aria-label="add"
                  onClick={handleClickOpenAddModal}
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
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              {/* --- Content --- */}
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    {renderRow(item, rowKeys)}
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                            onClick={() => handleClickOpenEditModal(item)}
                            style={{ backgroundColor: "#e0711d", color: "white" }}
                            >
                            Editar
                          </Button>
                          <Button
                            onClick={() => handleDelete(item.id)}
                            style={{ backgroundColor: "red", color: "white" }}
                            >
                            Eliminar
                          </Button>
                        </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Root>
      </Container>
      {title === TableType.STUDENTS && (
        <>
          {addStudentModal()}
          {editStudentModal()}
        </>
        )
      };
      {title === TableType.TUTORS && (
        <>
          {addTutorModal()}
          {editTutorModal()}
        </>
        )
      };
      {title === TableType.TOPICS && addTopicModal()}
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
