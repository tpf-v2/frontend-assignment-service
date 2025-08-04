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
  tutors
  
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
                  disabled={disableEditId}
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
                  disabled={disableEditId}
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
                  disabled={disableEditId}
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
                  disabled={disableEditId}
                />

                {/* Tema y tutor */} {/* aux: los copypasteo de StudentForm */}
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel>Tema 2</InputLabel>
                    <Select
                      name="topic2"
                      value={item.topic?.name || "Sin asignar!!! VERRRRRR"}
                      onChange={(e) =>
                        setItem({ ...item, topic_id: item.topic?.id }) 
                      }
                      label="Tema"
                      required
                    >
                      {topics.map((topic) => (
                        <MenuItem
                          key={topic.name}
                          value={topic.name}
                        >
                          {topic.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                
                <InputLabel margin="normal">Seleccionar tutor</InputLabel>
                <Select
                  margin="normal"
                  value={item.tutor_period_id || "VERRRRR cómo mostrar su NyA"}
                  label="Email de tutor"
                  onChange={(e) =>
                    setItem({ ...item, tutor_email: "a@b.c" })
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



                {/* Las tres preferencias, no editables */}
                <TextField
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  label="Preferencia 1"
                  value={item["name"] || ""}
                  required
                  onChange={(e) => setItem({ ...item, name: e.target.value })}

                />
                <TextField
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  label="Preferencia 2"
                  value={item["last_name"] || ""}
                  required
                  onChange={(e) =>
                    setItem({ ...item, last_name: e.target.value })
                  }
                />
                <TextField
                  type="email"
                  fullWidth
                  margin="normal"
                  label="Preferencia 3"
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