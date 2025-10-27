import { useState } from 'react';
import { TextField } from '@mui/material';
import { TitleSimple } from '../../styles/Titles';
import { RootMargin, ButtonSimple } from '../Root';

const Root = RootMargin;
const ButtonStyled = ButtonSimple;
const Title = TitleSimple;

const AddTopicForm = () => {
  const [newTopic, setNewTopic] = useState('');

  const handleTopicChange = (e) => {
    setNewTopic(e.target.value);
  };

  const handleAddTopicSubmit = (e) => {
    e.preventDefault();
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