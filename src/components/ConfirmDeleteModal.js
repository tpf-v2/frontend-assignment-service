// ConfirmDeleteModal.js
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const ConfirmDeleteModal = ({ open, onClose, onConfirm, showExtraWarningFor=undefined }) => {
  const handleConfirm = () => {
    onConfirm(); // Llama a onConfirm sin parámetros
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Eliminar Evento</DialogTitle>
      <DialogContent>
        <p>¿Realmente se desea eliminar este bloque de disponibilidad?</p>
        {showExtraWarningFor === "admin" && (
          <p><strong>Importante: esto eliminará irreversiblemente las disponibilidades que equipos y tutores hayan            
            cargado dentro de esta franja horaria ¿Eliminar?</strong></p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleConfirm}  color="error" variant="contained">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteModal;