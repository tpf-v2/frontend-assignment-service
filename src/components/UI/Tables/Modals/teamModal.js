import React from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    //
    Select,
    MenuItem,
    InputLabel,
    //
    FormControl,
    Typography
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { useOpenCloseStateModalLogic } from "./useOpenCloseStateModalLogic";
import Grid from "@mui/material/Grid";

/* Modals para Agregar y Editar un/a estudiante */
export const TeamModal = ({
  //openAddModal, // bools para ver si se debe abrir cada modal
  openEditModal,
  //setOpenAddModal, // necesarias para cerrar los modals
  setOpenEditModal,
  //handleAddItem, // las acciones al clickear confirmar desde cada modal
  handleEditItem,
  originalEditedItemId, // para pasárselo a la función que habla con la api al confirmar, y su set para el handle
  setOriginalEditedItemId,
  item, // recibido del parent, y su set para flushearlo al salir
  setParentItem,
  topics,
  tutors,
  periodId
  
}) => {

      // Creo los estados, gestiono handle open, y obtengo los handle close.
      const {
        newItem,
        setNewItem,
        editedItem,
        setEditedItem,
        handleCloseAddModal,
        handleCloseEditModal
      } = useOpenCloseStateModalLogic({
          openEditModal: openEditModal,
          item: item,
          setOpenAddModal: setOpenEditModal, // AUXXXX
          setOpenEditModal: setOpenEditModal,
          setOriginalEditedItemId: setOriginalEditedItemId,
          setParentItem: setParentItem
      });

      // AUX: ESTAS FUNCIONES DEBERÍAN SER IMPORTABLES []
      // Función para obtener el nombre del topic por su id
      const getTopicNameById = (id) => {
        const topic = topics.find((t) => t.id === id);
        return topic ? topic.name : ""; // Si no encuentra el topic, mostrar 'Desconocido'
      };
      // Función para obtener el nombre del tutor por su tutor period id
        const getTutorNameById = (id, periodId) => {
            const tutor = tutors.find(
            (t) =>
                t.tutor_periods &&
                t.tutor_periods.some((tp) => tp.period_id === periodId && tp.id === id)
            );
            return tutor ? tutor.name + " " + tutor.last_name : "Sin asignar"; // Si no encuentra el tutor, mostrar 'Sin asignar'
        };
        
    // AUX
    const getTopicById = (id) => {
        const topic = topics.find((t) => t.id === id);
        return topic ? topic : ""; // Si no encuentra el topic, mostrar 'Desconocido'
      };
    // Función para obtener el nombre del tutor por su id
    const getTutorEmailByTutorPeriodId = (id, periodId) => {
        const tutor = tutors.find(
        (t) =>
            t.tutor_periods &&
            t.tutor_periods.some((tp) => tp.period_id === periodId && tp.id === id)
        );
        return tutor ? tutor.email : "Sin asignar"; // Si no encuentra el tutor, mostrar 'Sin asignar'
    };




      /////// Modals ///////
      // Aux: este modal va a ser el de editar directamente, y no existirá por ahora Add acá.
      // Conservo la estructura solo x comodidad / analogía con otros archivos de modals. Ver dsp []
      const innerActionTeamModal = (bool, handleCloseModal, handleConfirmAction, item, setItem, TitleText, ConfirmButtonText, disableEditId=false) => {
        return (
          <Dialog open={bool} onClose={handleCloseModal} maxWidth={false} fullWidth>
            <DialogTitle
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: "#f5f5f5",
                color: "#333",
                padding: "16px 24px",
              }}
            >
              {TitleText} Equipo
            </DialogTitle>
            <form
              onSubmit={(e) => {
                e.preventDefault(); // previene el reload del form
                handleConfirmAction(item, setItem, handleCloseModal);
              }}
            >
              <DialogContent dividers sx={{ padding: "24px 24px 16px" }}>
              <NumericFormat
                  fullWidth
                  allowNegative={false}
                  customInput={TextField}
                  variant="outlined"
                  autoFocus
                  margin="normal"
                  label="Equipo número"
                  value={item["id"] || ""}
                  required
                  onChange={(e) =>
                    setItem({ ...item, id: parseInt(e.target.value) })
                  }
                  disabled
                />
                {/* Campos editables */}
                <Grid container spacing={2}>
                {/* Columna izquierda */}
                  <Grid item xs={6} md={6}>
                    {/* Integrantes */}
                    <Typography variant="h6" gutterBottom>
                      Integrantes
                    </Typography>
                    {/* Integrante 1 */}
                    <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                      <Grid item xs={2}>
                        <NumericFormat
                          //fullWidth
                          allowNegative={false}
                          customInput={TextField}
                          variant="outlined"
                          autoFocus
                          margin="normal"
                          label="Padrón"
                          value={item?.students?.[0].id || ""}
                          required
                          onChange={(e) =>
                            {const newStudents = [...item.students];
                                newStudents[0] = { ...newStudents[0], id: parseInt(e.target.value) };
                                setItem({ ...item, students: newStudents });
                                }
                          }
                        />
                      </Grid>
                      <Grid item xs={10}>
                        <TextField
                          variant="outlined"
                          //fullWidth
                          margin="normal"
                          label="Nombre"
                          value={`${item.students?.[0]?.name || ""} ${item.students?.[0]?.last_name || ""}`}
                          required
                          onChange={(e) => setItem({ ...item, name: e.target.value })} // [] NO, VER.
                        />
                      </Grid>

                    </Grid>

                    {/* Integrante 2 - generalizar */}
                    <NumericFormat
                      //fullWidth
                      allowNegative={false}
                      customInput={TextField}
                      variant="outlined"
                      autoFocus
                      margin="normal"
                      label="Padrón integrante 2"
                      value={item?.students?.[1].id || ""}
                      onChange={(e) =>
                        {const newStudents = [...item.students];
                        newStudents[1] = { ...newStudents[1], id: parseInt(e.target.value) };
                        setItem({ ...item, students: newStudents });
                        }
                      }
                    />
                    <NumericFormat
                      fullWidth
                      allowNegative={false}
                      customInput={TextField}
                      variant="outlined"
                      autoFocus
                      margin="normal"
                      label="Padrón integrante 3"
                      value={item?.students?.[2].id || ""}
                      onChange={(e) =>
                        {const newStudents = [...item.students];
                            newStudents[2] = { ...newStudents[2], id: parseInt(e.target.value) };
                            setItem({ ...item, students: newStudents });
                        }
                      }
                    />
                    <NumericFormat
                      fullWidth
                      allowNegative={false}
                      customInput={TextField}
                      variant="outlined"
                      autoFocus
                      margin="normal"
                      label="Padrón integrante 4"
                      value={item?.students?.[3].id || ""}
                      onChange={(e) =>
                        {const newStudents = [...item.students];
                            newStudents[3] = { ...newStudents[3], id: parseInt(e.target.value) };
                            setItem({ ...item, students: newStudents });
                        }
                      }
                      // Aux:
                      // Pero no confiar, VER qué pasa con el orden de students, viene desde el back. [].
                    />

                  </Grid>

                  {/* Columna derecha */}
                  <Grid item xs={6} md={6}>

                  {/* Tema y tutor */} {/* aux: los copypasteo de StudentForm */}
                  <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel>Tema</InputLabel>
                      <Select
                        value={item.topic?.id || ""}
                        onChange={(e) =>
                          setItem({ ...item, topic: getTopicById(e.target.value) })
                        }
                        label="Tema"
                        required
                      >
                        {topics.map((topic) => (
                          <MenuItem
                            key={topic.id}
                            value={topic.id}
                          >
                            {topic.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  
                  <FormControl fullWidth variant="outlined" margin="normal">
                    {<InputLabel margin="normal">Tutor/a</InputLabel>
                    }
                    <Select
                      margin="normal"
                      value={item.tutor_period_id || ""}
                      label="Tutor"
                      onChange={(e) =>
                        setItem({ ...item, tutor_period_id: e.target.value })
                      }
                      required
                      fullWidth
                    >
                      <MenuItem key="" value="" disabled>
                        Seleccionar tutor
                      </MenuItem>
                      {tutors.map((tutor) => {
                        const tp = tutor.tutor_periods.find((tp) => tp.period_id === periodId);
                        if (!tp) return null; // ignorar si no hay uno del period pedido

                        return (
                            <MenuItem key={tp.id} value={tp.id}>
                            {tutor.name} {tutor.last_name}
                            </MenuItem>
                        );
                        })}

                    </Select>
                  </FormControl>



                  {/* Las tres preferencias, no editables */}
                  <TextField
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    label="Preferencia 1"
                    value={item?.preferred_topics?.[0]
                      ? getTopicNameById(item.preferred_topics[0])
                      : ""}
                    disabled
                  />
                  <TextField
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    label="Preferencia 2"
                    value={item?.preferred_topics?.[1]
                      ? getTopicNameById(item.preferred_topics[1])
                      : ""}
                    disabled
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Preferencia 3"
                    variant="outlined"
                    value={item?.preferred_topics?.[2]
                      ? getTopicNameById(item.preferred_topics[2])
                      : ""}
                    disabled
                  />
                  </Grid>

                </Grid> 
              </DialogContent>

              <DialogActions>
                <Button onClick={handleCloseModal} variant="outlined" color="error">
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {ConfirmButtonText}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        )
      };

      const addTeamModal = () => {
        // To-Doreturn innerActionStudentModal(openAddModal, handleCloseAddModal, handleAddItem, newItem, setNewItem, "Agregar", "Agregar")
      }
    
      const editTeamModal = () => {
        return innerActionTeamModal(openEditModal, handleCloseEditModal, handleEditItem, editedItem, setEditedItem, "Editar", "Guardar", true)
      }          

  return (
    <>
      {/*addTeamModal()*/};
      {editTeamModal()};
    </>
  )
}