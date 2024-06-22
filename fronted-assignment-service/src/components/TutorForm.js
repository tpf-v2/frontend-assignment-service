import React from 'react';
import { Typography, FormGroup, FormControlLabel, Checkbox, Box, Button, Container, Paper } from '@mui/material';
import { styled } from '@mui/system';

const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
}));

const topics = ['Álgebra', 'Cálculo', 'Física', 'Química'];

const TutorForm = () => {
  const [selectedTopics, setSelectedTopics] = React.useState([]);

  const handleTopicChange = (event) => {
    const newTopics = event.target.checked
      ? [...selectedTopics, event.target.name]
      : selectedTopics.filter((topic) => topic !== event.target.name);
    setSelectedTopics(newTopics);
  };

  return (
    <Container maxWidth="sm">
      <Root>
        <Title variant="h5">Seleccione los temas que va a tutorear</Title>
        <FormGroup>
          {topics.map((topic) => (
            <FormControlLabel
              control={<Checkbox name={topic} onChange={handleTopicChange} />}
              label={topic}
              key={topic}
            />
          ))}
        </FormGroup>
        <ButtonStyled variant="contained" color="primary">
          Enviar Temas
        </ButtonStyled>
      </Root>
    </Container>
  );
};

export default TutorForm;