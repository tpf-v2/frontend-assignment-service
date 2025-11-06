import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const EventModal = ({ open, onClose, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm(); 
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Nuevo Bloque de Disponibilidad</DialogTitle>
      <DialogContent>
        <p>¿Deseas crear un nuevo bloque de disponibilidad?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color="primary" variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventModal;