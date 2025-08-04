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
    FormControl
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { useOpenCloseStateModalLogic } from "./useOpenCloseStateModalLogic";

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
      // Función para obtener el nombre del tutor por su id
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
                {/* Integrantes */}
                <NumericFormat
                  fullWidth
                  allowNegative={false}
                  customInput={TextField}
                  variant="outlined"
                  autoFocus
                  margin="normal"
                  label="Padrón integrante 1"
                  value={item && item["students"] && item["students"][0] && item["students"][0]["id"] || ""}
                  required
                  onChange={(e) =>
                    setItem({ ...item, student_id_1: parseInt(e.target.value) })
                  }
                />
                <NumericFormat
                  fullWidth
                  allowNegative={false}
                  customInput={TextField}
                  variant="outlined"
                  autoFocus
                  margin="normal"
                  label="Padrón integrante 2"
                  value={item && item["students"] && item["students"][1] && item["students"][1]["id"] || ""}
                  required
                  onChange={(e) =>
                    setItem({ ...item, student_id_2: parseInt(e.target.value) })
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
                  value={item && item["students"] && item["students"][2] && item["students"][2]["id"] || ""}
                  required
                  onChange={(e) =>
                    setItem({ ...item, student_id_3: parseInt(e.target.value) })
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
                  value={item && item["students"] && item["students"][3] && item["students"][3]["id"] || ""}
                  required
                  onChange={(e) =>
                    setItem({ ...item, student_id_4: parseInt(e.target.value) })
                  }
                />

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
                
                <InputLabel margin="normal">Seleccionar tutor</InputLabel>
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
                        {tutor.email}
                        </MenuItem>
                    );
                    })}

                </Select>



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

    //   console.log("HOLAAAA");
    //   console.log("tutor ids", tutors.map(t => t.tutor_periods?.id));
    //   if (item) {

    //       console.log("item.tutor_period_id", item.tutor_period_id);
    //   }
          

  return (
    <>
      {/*addTeamModal()*/};
      {editTeamModal()};
    </>
  )
}