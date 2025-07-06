import React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { useOpenCloseStateModalLogic } from "./useOpenCloseStateModalLogic";

export const StudentModals = ({
  openAddModal, // bools para ver si se debe abrir cada modal
  openEditModal,
  setOpenAddModal, // necesarias para cerrar los modals
  setOpenEditModal,
  handleAddItem, // las acciones al clickear confirmar desde cada modal
  handleEditItem,
  originalEditedItemId, // para pasárselo a la función que habla con la api al confirmar _ no, ya lo tiene si se crea afuera. Necesito su set si debo tener acá ese handle.
  setOriginalEditedItemId,
  item, // recibido del parent, y su set para flushearlo al salir
  setParentItem
  
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
          setOpenAddModal: setOpenAddModal,
          setOpenEditModal: setOpenEditModal,
          setOriginalEditedItemId: setOriginalEditedItemId,
          setParentItem: setParentItem
      });

      /////// Modals de Estudiante ///////
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
              <Button onClick={() => handleConfirmAction(item, setItem, handleCloseModal)} variant="contained" color="primary">
                {ConfirmButtonText}
              </Button>
            </DialogActions>
          </Dialog>
        )
      };

      const addStudentModal = () => {
        return innerActionStudentModal(openAddModal, handleCloseAddModal, handleAddItem, newItem, setNewItem, "Agregar", "Agregar")
      }
    
      const editStudentModal = () => {
        return innerActionStudentModal(openEditModal, handleCloseEditModal, handleEditItem, editedItem, setEditedItem, "Editar", "Guardar")
      }

  return (
    <>
      {addStudentModal()};
      {editStudentModal()};
    </>
  )
}