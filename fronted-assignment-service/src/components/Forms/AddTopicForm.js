import React, { useState } from 'react';
import { Typography, TextField, Button, Paper } from '@mui/material';
import { styled } from '@mui/system';

const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
  marginBottom: theme.spacing(5),
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
}));

const AddTopicForm = () => {
  const [newTopic, setNewTopic] = useState('');

  const handleTopicChange = (e) => {
    setNewTopic(e.target.value);
  };

  const handleAddTopicSubmit = (e) => {
    e.preventDefault();
    console.log('Nuevo Tema:', newTopic);
    alert('Nuevo tema agregado con éxito');
    setNewTopic('');
  };

  return (
    <Root>
      <Title variant="h5">Agregar nuevo Tema</Title>
      <form onSubmit={handleAddTopicSubmit}>
        <TextField
          label="Nuevo Tema"
          name="newTopic"
          value={newTopic}
          onChange={handleTopicChange}
          fullWidth
          margin="normal"
          variant="outlined"
          required
        />
        <ButtonStyled variant="contained" color="primary" type="submit">
          Agregar Tema
        </ButtonStyled>
      </form>
    </Root>
  );
};

export default AddTopicForm;