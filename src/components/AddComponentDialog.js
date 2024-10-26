import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, FormControl, Button, TextField } from '@mui/material';

const AddTopicDialog = ({ open, handleClose }) => {
  const [newTopic, setNewTopic] = useState({ name: '', category: '' });

  const handleAddTopic = () => {
      console.log(`Add new topic ${newTopic.name}, ${newTopic.category}`);
      handleClose(true)
      setNewTopic({"name": "", "category": ""})
  };

  return (
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
  );
};

export default AddTopicDialog;
