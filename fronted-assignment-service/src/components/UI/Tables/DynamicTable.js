import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

// Estilos
const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#ffffff',
  boxShadow: theme.shadows[3],
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: '#0072C6',
  textAlign: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
}));

const DynamicTable = () => {
  const location = useLocation();
  const { endpoint } = location.state; // Recl endpoint a través de la navegación
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Endpoint: ", endpoint)
        const response = await axios.get("http://127.0.0.1:8000" + endpoint);
        setData(response.data); // Suponiendo que la respuesta es un array similar al ejemplo que diste
        console.log(response.data)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${endpoint}/${id}`); // Ajusta la URL según tu API
      setData(data.filter(item => item.answer_id !== id)); // Filtra el elemento eliminado
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (loading) return <Typography variant="h6">Cargando...</Typography>;

  return (
    <Container maxWidth="lg">
      <Root>
        <Title variant="h4">Lista de Respuestas</Title>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Integrantes</TableCell>
                <TableCell>Temas</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.answer_id}>
                  <TableCell>{item.answer_id}</TableCell>
                  <TableCell>{item.students.join(', ')}</TableCell>
                  <TableCell>{item.topics.join(', ')}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleDelete(item.answer_id)} style={{ backgroundColor: 'red', color: 'white' }}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Root>
    </Container>
  );
};

export default DynamicTable;