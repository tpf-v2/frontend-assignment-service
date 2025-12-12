// Nadie usa esta FormSelection, sus únicos dos usos están comentados.

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getFormAnswersById } from '../../api/getFormAnswersById';
import { useState } from 'react';

const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#f5f5f5',
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  width: '80%',
  padding: theme.spacing(1.5),
  fontSize: '1rem',
  '&.MuiButton-containedPrimary': { backgroundColor: '#0072C6' },
  '&.MuiButton-containedSecondary': { backgroundColor: '#A6A6A6' },
  '&:hover.MuiButton-containedPrimary': { backgroundColor: '#005B9A' },
  '&:hover.MuiButton-containedSecondary': { backgroundColor: '#7A7A7A' },
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(0),
  color: '#0072C6',
  textAlign: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
  textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
}));

// Nadie usa esto
const FormSelection = () => {
  const { cuatrimestre } = useParams(); // Captura del cuatrimestre
  const period = useSelector((state) => state.period);

  const navigate = useNavigate(); // Hook para navegación
  const user = useSelector((state) => state.user); // Obtener el usuario desde Redux
  const [teamCount, setTeamAnswer] = useState([]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchTeamAnswer = async () => {
      try {
        const response = await getFormAnswersById(period.id, user);
        const teamCount = response.data.length; // []
        setTeamAnswer(teamCount);
      } catch (error) {
        console.error("Error al obtener los topics", error);
      }
    };
  
    fetchTeamAnswer();
  }, []); 

  return (
    <Container maxWidth="sm">
      <Root>
        <Title variant="h4" style={{ color: '#555' }}>
          {cuatrimestre}
        </Title>
        {user.temporal_role !== 'admin' ? (
          <Title variant="h6">¡{user.name}, te damos la bienvenida!</Title>
        ) : null}
        {user.temporal_role === 'student' && (
            <Typography variant="h6">
              Tu padrón se registró en {teamCount} respuesta{teamCount !== 1 ? 's' : ''}
            </Typography>
        )}
        <Box textAlign="center">
          {user.temporal_role === 'student' && (
            <ButtonStyled variant="contained" color="primary" onClick={() => handleNavigation('/student-form')}>
              Enviar Formulario de Equipo
            </ButtonStyled>
          )}
          {user.temporal_role === 'tutor' && (
            <ButtonStyled variant="contained" color="primary" onClick={() => handleNavigation('/tutor-form')}>
              Enviar Formulario de Temas a Tutorear
            </ButtonStyled>
          )}
        </Box>
      </Root>
    </Container>
  );
};

export default FormSelection;