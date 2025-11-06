// ConfirmDeleteModal.js
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { DELETE_MSG_FOR } from './datesMsgsEnums.js';

const ConfirmDeleteModal = ({ open, onClose, onConfirm, msgFor = undefined}) => {
  const handleConfirm = () => {
    onConfirm(); // Llama a onConfirm sin parámetros
  };

  // No renderizar hasta que esté la prop cargada
  if (!msgFor) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Eliminar Evento</DialogTitle>
      <DialogContent>

        {/* estudiantes y tutores borran su disponibilidad */}
        {msgFor === DELETE_MSG_FOR.NON_ADMIN_ROLES && ( 
          <p>¿Realmente se desea eliminar este bloque de disponibilidad?</p>
          )
        }
        
        {/* admin borra lo disponible */}
        {msgFor === DELETE_MSG_FOR.ADMIN && (
          <>
            <p>¿Realmente se desea eliminar este rango horario de las fechas de exposición disponibles?</p>

            <p><strong>Importante: esto eliminará irreversiblemente las disponibilidades que equipos y tutores hayan            
              cargado dentro de esta franja horaria ¿Eliminar?</strong></p>
          </>
        )}

        {/* admin desde el modo de edición, borra resultado de asignación */}
        {msgFor === DELETE_MSG_FOR.ADMIN_EDIT_MODE && (
          <p>¿Realmente se desea eliminar esta asignación?</p> 
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