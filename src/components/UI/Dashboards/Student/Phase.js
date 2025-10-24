import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import Milestone from './Milestone';
import { Alert } from '@mui/material';

const PhaseContainer = styled(Box)(({ theme }) => ({
  border: '2px solid #b8b6b6',
  borderRadius: '8px',
  padding: theme.spacing(2),
  margin: theme.spacing(2, 0),
  position: 'relative',
  backgroundColor: '#f9f9f9',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
}));

const Connector = styled(Box)({
  position: 'absolute',
  left: '-5%',
  top: '0px', // Ajustar para que esté alineado con el círculo
  width: '4px',
  height: 'calc(100% + 25px)',
  backgroundColor: 'transparent',
  borderLeft: '2px dashed #0072C6',
  zIndex: -1,
  borderRadius: '2px',
});

const Circle = styled(Box)(({ completed }) => ({
  width: '30px', // Tamaño aumentado
  height: '30px', // Tamaño aumentado
  borderRadius: '50%',
  backgroundColor: completed ? '#5cb85c' : '#b8b6b6',
  position: 'absolute',
  left: '-50px', // Posición centrada
  top: '40%', // Para alinearlo con el conector
  transition: 'background-color 0.3s ease',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
}));

const MilestoneContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridAutoFlow: 'column',
  gridAutoColumns: '1fr',
  marginTop: theme.spacing(2),
  gap: "1em"
}));

const Phase = ({ phase, tasks, circle, description }) => {
  const allTasksCompleted = tasks.every((task) => task.completed);
  if (!description){
    description=""
  }
  return (
    <PhaseContainer>
      {circle && <Circle completed={allTasksCompleted} />}
      <Connector />
      <Typography variant="h5" gutterBottom>
        {phase}
      </Typography>
      <MilestoneContainer>
        {tasks.map((task, index) => (
          <Milestone key={index} title={task.title} completed={task.available} url={ task.available ? (task.completed ? task.urlCompleted : task.urlNotCompleted) : null} />
        ))}
      {!!description && <Alert severity="info">{description}</Alert>}
      </MilestoneContainer>
      <Box>
      </Box>
    </PhaseContainer>
  );
};

export default Phase;