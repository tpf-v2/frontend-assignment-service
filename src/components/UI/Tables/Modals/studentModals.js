// const [openAddModal, setOpenAddModal] = useState(false);
// const [openEditModal, setOpenEditModal] = useState(false);
import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { NumericFormat } from "react-number-format";

export const StudentModals = ({
  openAddModal, // bools para ver si se debe abrir cada modal
  openEditModal,
  setOpenAddModal, // necesarias para cerrar los modals
  setOpenEditModal,
  handleAddItem, // las acciones al clickear confirmar desde cada modal
  handleEditItem,
  originalEditedItemId, // para pasárselo a la función que habla con la api al confirmar _ no, ya lo tiene si se crea afuera. Necesito su set si debo tener acá ese handle.
  setOriginalEditedItemId
  
}) => {
  
      const [newItem, setNewItem] = useState({});
      const [editedItem, setEditedItem] = useState({}); // data
      
      ///// Estos handles podrían ir en otro lado /////
      const handleClickOpenAddModal = () => {
          setOpenAddModal(true);
      };
      
      const handleClickOpenEditModal = (item) => {
          // El id puede cambiar, así que guardamos el id original
          setOriginalEditedItemId(item.id);
          setEditedItem(item);
          setOpenEditModal(true);    
      };

      const handleCloseAddModal = () => {
          setNewItem({})
          setOpenAddModal(false);
      };
      
      const handleCloseEditModal = () => {
          setEditedItem({})
          setOpenEditModal(false);
      };

      /////// Modals de Estudiante ///////
      const innerActionStudentModal = (bool, handleCloseModal, handleConfirmAction, item, setItem, TitleText, ConfirmButtonText) => {    
        // y si pongo el set acá?
        setEditedItem(item); // éste es el set complicado xq se crea acá adentro
        setOriginalEditedItemId(item.id);
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

      // const addStudentModal = () => {
      //   return innerActionStudentModal(openAddModal, handleCloseAddModal, handleAddItem, newItem, setNewItem, "Agregar", "Agregar")
      // }
    
      // const editStudentModal = () => {
      //   return innerActionStudentModal(openEditModal, handleCloseEditModal, handleEdit, editedItem, setEditedItem, "Editar", "Guardar")
      // }
  return (
    <>
      {innerActionStudentModal(openAddModal, handleCloseAddModal, handleAddItem, newItem, setNewItem, "Agregar", "Agregar")};
      {innerActionStudentModal(openEditModal, handleCloseEditModal, handleEditItem, editedItem, setEditedItem, "Editar", "Guardar")};
    </>
  )
}