// Nadie usa este OldDashboard.

import React, { useEffect, useState } from 'react';
import { Container, Button, Typography, Box, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate, useParams } from 'react-router-dom';
import { getDashboardData } from '../../../../api/dashboardStats';
import { useSelector } from 'react-redux';
import StatCard from './Components/StatCard';  // Import StatCard Component
import BarChartComponent from './Components/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';

// Estilos
const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#ffffff',
  boxShadow: theme.shadows[3],
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  width: '48%',
  padding: theme.spacing(1.5),
  fontSize: '1rem',
  backgroundColor: '#0072C6',
  color: '#ffffff',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: '#005B9A',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: '#0072C6',
  textAlign: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
  flexGrow: 1, // Asegura que ocupa todo el espacio
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  padding: theme.spacing(2),
}));

const OldDashboard = () => {
  const navigate = useNavigate();
  const { period } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const getData = async () => {
    try {
      const data = await getDashboardData(period, user);
      setDashboardData(data);
    } catch (error) {
      console.error('Error al obtener datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [loading]); 
  
  // if (loading) {
  //   return <div>Cargando...</div>; // Indicador de carga
  // }

  return (
    <Container maxWidth="lg">
      <Root>
        <Box display="flex" alignItems="center">
          <Title variant="h4">{period}</Title>
          <SettingsIcon
            fontSize="large"
            style={{ cursor: 'pointer', marginLeft: 'auto' }} // Lo empuja a la derecha
            onClick={() => navigate(`/period-config`)} // Navegar a la vista de configuración
          />
        </Box>
        <Box mt={2} display="flex" flexDirection="column" alignItems="center">
          {/* Buttons Section */}
          <Box display="flex" justifyContent="space-between" width="100%">
            <ButtonStyled onClick={() => handleNavigation(`/upload-students/${period}`)}> ARCHIVO DE ESTUDIANTES</ButtonStyled>
            <ButtonStyled onClick={() => handleNavigation(`/upload-tutors/${period}`)}> ARCHIVO DE TUTORES</ButtonStyled>
            <ButtonStyled onClick={() => handleNavigation(`/upload-topics/${period}`)}> ARCHIVO DE TEMAS</ButtonStyled>
          </Box>
          <Box display="flex" justifyContent="space-between" width="100%">
            <ButtonStyled onClick={() => navigate(`/dashboard/${period}/students`)}> LISTA ESTUDIANTES</ButtonStyled>
            <ButtonStyled onClick={() => navigate(`/dashboard/${period}/tutors`)}> LISTA TUTORES</ButtonStyled>
            <ButtonStyled onClick={() => navigate(`/dashboard/${period}/topics`)}> LISTA TEMAS</ButtonStyled>
          </Box>
        </Box>

        {/* Statistics Section */}
        <Box mt={4}>
          <StatsContainer>
            <StatCard title="Total de Estudiantes" value={loading? -1 : dashboardData.studentCard} />
            <StatCard title="Total de Tutores" value={loading? -1 : dashboardData.tutorsCard} />
            <StatCard title="Total de Temas" value={loading? -1 : dashboardData.topicsCard} />
          </StatsContainer>
          <Box mt={2} display="flex" flexDirection="column" alignItems="center">
            <Box mt={2} display="flex" flexDirection="row" justifyContent="space-evenly" alignItems="center" width="100%">
              <ButtonStyled onClick={() => navigate(`/dashboard/${period}/form-answers`)}> RESPUESTAS</ButtonStyled>
              <ButtonStyled onClick={() => navigate(`/dashboard/${period}/groups`)}> EQUIPOS</ButtonStyled>
            </Box>
            
            {/* Bar Chart Section */}
            {!loading && <BarChartComponent data={dashboardData.answersChart} />}
          </Box>
        </Box>
      </Root>
    </Container>
  );
};

export default OldDashboard;