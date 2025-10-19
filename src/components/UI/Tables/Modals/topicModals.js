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
  InputLabel
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { useOpenCloseStateModalLogic } from "./useOpenCloseStateModalLogic";

/* Modals para Agregar y Editar un tema */
export const TopicModals = ({
  openAddModal, // bools para ver si se debe abrir cada modal
  openEditModal,
  setOpenAddModal, // necesarias para cerrar los modals
  setOpenEditModal,
  handleAddItem, // las acciones al clickear confirmar desde cada modal
  handleEditItem,
  originalEditedItemId, // para pasárselo a la función que habla con la api al confirmar, y su set para el handle
  setOriginalEditedItemId,
  item, // recibido del parent, y su set para flushearlo al salir
  setParentItem,
  tutors, // estos dos []
  categories

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
    const innerActionTopicModal = (bool, handleCloseModal, handleConfirmAction, item, setItem, titleText, confirmButtonText) => {
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
              {titleText} Tema
            </DialogTitle>
            <form
              onSubmit={(e) => {
                e.preventDefault(); // previene el reload del form
                handleConfirmAction(item, setItem, handleCloseModal);
              }}
            >
              <DialogContent dividers sx={{ padding: "24px 24px 16px" }}>
                <TextField
                  variant="outlined"
                  autoFocus
                  fullWidth
                  margin="normal"
                  label="Titulo"
                  value={item.name || ""}
                  required
                  onChange={(e) => setItem({ ...item, name: e.target.value })}
                />
                <InputLabel>Seleccionar categoría</InputLabel>
                <Select
                  value={
                    item.category?.name || ""
                  }
                  label="Categorías"
                  onChange={(e) =>
                    setItem({ ...item, category: {name: e.target.value} })
                  }
                  margin="normal"
      
                  sx={{ marginBottom: "8px" }}
                  required
                  fullWidth
                >
                  <MenuItem key="" value="" disabled>
                    Seleccionar categoría
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
                    item["tutor_email"] || ""
                  }
                  label="Email de tutor"
                  onChange={(e) =>
                    setItem({ ...item, tutor_email: e.target.value })
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
                <Button type="submit" variant="contained" color="primary">
                  {confirmButtonText}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        )
      };

      const addTopicModal = () => {
        return innerActionTopicModal(openAddModal, handleCloseAddModal, handleAddItem, newItem, setNewItem, "Agregar Nuevo", "Agregar");
      };
    
      const editTopicModal = () => {
        return innerActionTopicModal(openEditModal, handleCloseEditModal, handleEditItem, editedItem, setEditedItem, "Editar", "Guardar");
      };

      return (
        <>
            {addTopicModal()}
            {editTopicModal()}
        </>
      )
}
