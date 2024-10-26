import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, Button, TextField } from '@mui/material';
import MySnackbar from '../components/UI/MySnackBar';

const AddTopicDialog = ({ open, handleClose }) => {
  const [newTopic, setNewTopic] = useState({ name: '', category: '' });

  const handleAddTopic = () => {
    try {
      console.log(`Add new topic ${newTopic.name}, ${newTopic.category}`);
      setNewTopic({ "name": "", "category": "" })
      setNotification({
        open: true,
        message: "Tema agregado éxitosamente",
        status: "success",
      });
      handleClose(true)
    } catch (err) {
      setNotification({
        open: true,
        message: "El tema que intentas agregar ya existe",
        status: "error",
      });
    }

  };

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Agregar Nuevo Tema</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <TextField
            id="titulo"
            variant="outlined"
            fullWidth
            placeholder="Título"
            value={newTopic.name}
            onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            id="categoria"
            variant="outlined"
            fullWidth
            placeholder="Categoría"
            value={newTopic.category}
            onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleAddTopic} color="primary">
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
    <MySnackbar
      open={notification.open}
      handleClose={handleSnackbarClose}
      message={notification.message}
      status={notification.status}
    />
    </>
  );
};

export default AddTopicDialog;
