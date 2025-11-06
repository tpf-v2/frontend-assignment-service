import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { ADD_MSG_FOR } from './datesMsgsEnums';

const EventModal = ({ open, onClose, onConfirm, msgFor = undefined }) => {
  const handleConfirm = () => {
    onConfirm(); 
  };

  // No renderizar hasta que esté la prop cargada
  if (!msgFor) return null;

  const getTitle = () => {
    if (msgFor === ADD_MSG_FOR.ADMIN) {
      return "Nuevo Rango Disponible Para Exposiciones";
    }
    else return "Nueva Disponibilidad";
  }
  const getContent = () => {
    if (msgFor === ADD_MSG_FOR.ADMIN) {
      return <p>¿Deseas indicar que este rango está disponible para exposiciones?</p>;
    }
    else return <p>¿Deseas indicar disponibilidad en este rango horario?</p>;
  }

  return (
    <Dialog open={open} onClose={onClose}>

      <DialogTitle>
        {getTitle()}
      </DialogTitle>
      <DialogContent>
        {getContent()}
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