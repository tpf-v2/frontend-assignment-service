import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import Milestone from './Milestone';

const PhaseContainer = styled(Box)(({ theme }) => ({
  border: '2px solid #0072C6',
  borderRadius: '8px',
  padding: theme.spacing(2),
  margin: theme.spacing(3, 0),
  position: 'relative',
  backgroundColor: '#f9f9f9',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
}));

const Connector = styled(Box)({
  position: 'absolute',
  left: '50%',
  top: '0px', // Cambiar para que el conector empiece justo arriba del círculo
  width: '4px',
  height: 'calc(100% + 20px)', // Extender el conector para que cruce la fase
  backgroundColor: '#0072C6',
  zIndex: -1,
  borderRadius: '10px',
});

const MilestoneContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-evenly',
  marginTop: theme.spacing(4),
  position: 'relative', // Hacer el contenedor relativo para posicionar el conector
}));

const Circle = styled(Box)(({ completed }) => ({
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: completed ? '#5cb85c' : '#d9534f',
  position: 'absolute',
  left: '-10px',
  top: '10px',
  transition: 'background-color 0.3s ease',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
}));

const Phase = ({ phase, tasks }) => {
  const allTasksCompleted = tasks.every((task) => task.completed);

  return (
    <PhaseContainer>
      <Circle completed={allTasksCompleted} />
      <Typography variant="h5" gutterBottom>
        {phase}
      </Typography>
      <MilestoneContainer>
        {tasks.map((task, index) => (
          <Milestone key={index} title={task.title} completed={task.completed} />
        ))}
      </MilestoneContainer>
      {phase !== 'Entrega Intermedia' && <Connector />}
    </PhaseContainer>
  );
};

export default Phase;