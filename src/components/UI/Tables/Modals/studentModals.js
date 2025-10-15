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

/* Modals para Agregar y Editar un/a estudiante */
export const StudentModals = ({
  openAddModal, // bools para ver si se debe abrir cada modal
  openEditModal,
  setOpenAddModal, // necesarias para cerrar los modals
  setOpenEditModal,
  handleAddItem, // las acciones al clickear confirmar desde cada modal
  handleEditItem,
  originalEditedItemId, // para pasárselo a la función que habla con la api al confirmar, y su set para el handle
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

      /////// Modals ///////
      const innerActionStudentModal = (bool, handleCloseModal, handleConfirmAction, item, setItem, TitleText, ConfirmButtonText, disableEditId=false) => {
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
              {TitleText} Estudiante
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
                  label="Padrón"
                  value={item["student_number"] || ""}
                  required
                  onChange={(e) =>
                    setItem({ ...item, student_number: parseInt(e.target.value) })
                  }
                  disabled={disableEditId}
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
                <Button type="submit" variant="contained" color="primary">
                  {ConfirmButtonText}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        )
      };

      const addStudentModal = () => {
        return innerActionStudentModal(openAddModal, handleCloseAddModal, handleAddItem, newItem, setNewItem, "Agregar", "Agregar")
      }
    
      const editStudentModal = () => {
        return innerActionStudentModal(openEditModal, handleCloseEditModal, handleEditItem, editedItem, setEditedItem, "Editar", "Guardar", true)
      }

  return (
    <>
      {addStudentModal()}
      {editStudentModal()}
    </>
  )
}
