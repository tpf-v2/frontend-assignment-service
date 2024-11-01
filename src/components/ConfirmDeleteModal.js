// ConfirmDeleteModal.js
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const ConfirmDeleteModal = ({ open, onClose, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm(); // Llama a onConfirm sin parámetros
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Eliminar Evento</DialogTitle>
      <DialogContent>
        <p>¿Estás seguro de que deseas eliminar este bloque de disponibilidad?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
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