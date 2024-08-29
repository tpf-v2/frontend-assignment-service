import React, { useEffect, useState } from 'react';
import { Container, Button, Typography, Box, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate, useParams } from 'react-router-dom';
import { getDashboardData } from '../../../api/dashboardStats';
import { useSelector } from 'react-redux';

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
}));

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  padding: theme.spacing(2),
}));

const StatCard = styled(Paper)(({ theme }) => ({
  flex: '1 1 30%', // Toma un tercio del ancho disponible
  margin: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  textAlign: 'center',
}));

// Datos de ejemplo
const data = [
  { name: 'Alumnos Inscriptos', value: 400 },
  { name: 'Tutores', value: 300 },
  { name: 'Temas', value: 300 },
  { name: 'Grupos', value: 200 },
];

const barData = [
  { name: '4 Integrantes', cantidad: 12 },
  { name: '3 Integrantes', cantidad: 4 },
  { name: '2 Integrantes', cantidad: 2 },
  { name: '1 Integrante', cantidad: 8 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { cuatrimestre } = useParams(); // Captura del cuatrimestre
  const [dashboardData, setDashboardData] = useState(null); // Estado para almacenar datos del dashboard
  const [loading, setLoading] = useState(true); // Estado de carga
  const user = useSelector((state) => state.user);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const getData = async () => {

    try {
      const data = await getDashboardData(cuatrimestre, user);
      setDashboardData(data); // Actualiza el estado con los datos obtenidos
    } catch (error) {
      console.error('Error al obtener datos del dashboard:', error);
    } finally {
      setLoading(false); // Finaliza el estado de carga, independientemente del resultado
    }
  };

  useEffect(() => {
    getData();
  }, []); // Se ejecuta solo una vez

  if (loading) {
    return <div>Cargando...</div>; // Indicador de carga
  }

  const handleView = (endpoint, columns, columnNames) => {
    navigate('/table-view', { state: { endpoint, columns, columnNames } });
  };

  return (
    <Container maxWidth="lg">
      <Root>
        <Title variant="h4">{cuatrimestre}</Title>
        <Box mt={2} display="flex" flexDirection="column" alignItems="center">
          <Box display="flex" justifyContent="space-between" width="100%">
            <ButtonStyled variant="contained" color="primary" onClick={() => handleNavigation(`/upload-students/${cuatrimestre}`)}>CARGAR ARCHIVO DE ALUMNOS</ButtonStyled>
            <ButtonStyled variant="contained" color="primary" onClick={() => handleNavigation(`/upload-topics/${cuatrimestre}`)}>CARGAR ARCHIVO DE TEMAS</ButtonStyled>
            <ButtonStyled variant="contained" color="primary" onClick={() => handleNavigation(`/upload-tutors/${cuatrimestre}`)}>CARGAR ARCHIVO DE TUTORES</ButtonStyled>
          </Box>
          <Box display="flex" justifyContent="space-between" width="100%">
            <ButtonStyled variant="contained" onClick={() => navigate(`/dashboard/${cuatrimestre}/students`)}>VER LISTA ALUMNOS</ButtonStyled>
            <ButtonStyled variant="contained" onClick={() => navigate(`/dashboard/${cuatrimestre}/topics`)}>VER LISTA TEMAS</ButtonStyled>
            <ButtonStyled variant="contained" onClick={() => navigate(`/dashboard/${cuatrimestre}/tutors`)}>VER LISTA TUTORES</ButtonStyled>
          </Box>
        </Box>

        {/* Sección para mostrar estadísticas */}
        <Box mt={4}>
          <StatsContainer>
            <StatCard>
              <Typography variant="h6">Total de Alumnos</Typography>
              <Typography variant="h3" color="#0072C6">{dashboardData.studentCard}</Typography>
            </StatCard>
            <StatCard>
              <Typography variant="h6">Total de Temas</Typography>
              <Typography variant="h3" color="#0072C6">{dashboardData.topicsCard}</Typography>
            </StatCard>
            <StatCard>
              <Typography variant="h6">Total de Tutores</Typography>
              <Typography variant="h3" color="#0072C6">{dashboardData.tutorsCard}</Typography>
            </StatCard>
          </StatsContainer>
          <Box mt={4}>
        <Typography variant="h5" style={{ marginBottom: '20px', color: '#555' }}>
            Conformación de grupos    
        </Typography>


        <Box mt={2} display="flex" flexDirection="row" alignItems="center">
          
            <ButtonStyled onClick={() => navigate(`/dashboard/${cuatrimestre}/form-answers`)}>VER RESPUESTAS</ButtonStyled>          
            <ButtonStyled onClick={() => navigate(`/dashboard/${cuatrimestre}/groups`)}>VER GRUPOS</ButtonStyled>
          
        </Box>

            <Typography variant="h6" style={{ padding: '16px', color: '#0072C6', textAlign: 'left' }}>Integrantes por respuesta</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.answersChart}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#0072C6" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Root>
    </Container>
  );
};

export default Dashboard;