import React, { useState } from 'react';
import { Typography, Box, Button, Container, Paper, MenuItem, FormControl, InputLabel, Select, Chip } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';

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

const topics = ['Álgebra', 'Cálculo', 'Física', 'Química', 'Probabilidad', 'Estadística'];

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224, // Altura máxima del dropdown
      width: 250,
    },
  },
};

const TutorForm = () => {
  const theme = useTheme();
  const [selectedTopics, setSelectedTopics] = useState([]);

  const handleTopicChange = (event) => {
    setSelectedTopics(event.target.value);
  };

  const handleDelete = (topicToDelete) => () => {
    setSelectedTopics((topics) => topics.filter((topic) => topic !== topicToDelete));
  };

  return (
    <Container maxWidth="sm">
      <Root>
        <Title variant="h5">Seleccione los temas que va a tutorear</Title>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Temas</InputLabel>
          <Select
            label="Temas"
            multiple
            value={selectedTopics}
            onChange={handleTopicChange}
            MenuProps={MenuProps}
            renderValue={(selected) => (
              <Box display="flex" flexWrap="wrap">
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    style={{ margin: 2 }}
                    onDelete={handleDelete(value)}
                  />
                ))}
              </Box>
            )}
          >
            {topics.map((topic) => (
              <MenuItem key={topic} value={topic}>
                {topic}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <ButtonStyled variant="contained" color="primary">
          Enviar Temas
        </ButtonStyled>
      </Root>
    </Container>
  );
};

export default TutorForm;