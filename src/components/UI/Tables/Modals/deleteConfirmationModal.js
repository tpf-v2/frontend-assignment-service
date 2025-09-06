import {React, useEffect} from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useOpenCloseStateModalLogic } from "./useOpenCloseStateModalLogic";

/* Modals para Agregar y Editar un/a estudiante */
export const DeleteConfirmationModal = ({
  openModal, // Bool para ver si se debe abrir el modal
  setOpenModal, // necesario para cerrar el modal
  handleDelete, // Acción al clickear confirmar desde el modal
  item, // Recibido del parent, y su set para flushearlo al salir
  setParentItem,
  itemTypeName // para printear en el mensaje ("respuesta", "tutor", "estudiante", "tema")
  
}) => {

      // Gestiono handle close
      const handleCloseModal = () => {
        setOpenModal(false);
        setParentItem(null);
      };

      /////// Modal ///////
      // (Sé que es un poco redundante pasar argumentos acá siendo que son properties,
      // se hace así por analogía con los otros modals y claridad). 
      const confirmationModal = (bool, handleCloseModal, handleConfirmAction, item, itemTypeName) => {
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
              Eliminar {itemTypeName}
            </DialogTitle>
            <form
              onSubmit={(e) => {
                e.preventDefault(); // previene el reload del form
                handleConfirmAction(item.id, handleCloseModal);                
              }}
            >
              <DialogContent dividers sx={{ padding: "24px 24px 16px" }}>
                ¿Confirmar la eliminación de {itemTypeName}?
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal} variant="outlined" color="error">
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={!item}>
                  Confirmar
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        )
      };

      
  return (
    <>
      {confirmationModal(openModal, handleCloseModal, handleDelete, item, itemTypeName)};
    </>
  )
}