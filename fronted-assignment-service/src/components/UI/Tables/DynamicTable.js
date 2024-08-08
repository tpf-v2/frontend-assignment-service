import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useLocation } from 'react-router-dom';
import { getTableData, deleteResponse } from '../../../api/handleTableData';

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
  const { endpoint } = location.state; // Recibe el endpoint desde la navegación
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await getTableData(endpoint);
        setData(responseData); // Guarda los datos en el estado
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Maneja el error
      }
    };

    fetchData();
  }, [endpoint]);

  const handleDelete = async (endpoint,id) => {
    try {
      await deleteResponse(endpoint,id); // Llama a deleteResponse para eliminar el registro
      setData(data.filter(item => item.answer_id !== id)); // Actualiza el estado
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (loading) return <Typography variant="h6">Cargando...</Typography>;

  const keys = Object.keys(data[0] || {});

  return (
    <Container maxWidth="lg">
      <Root>
        <Title variant="h4">Lista de Respuestas</Title>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {keys.map(key => (
                  <TableCell key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</TableCell>
                ))}
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.answer_id}>
                  {keys.map(key => (
                    <TableCell key={key}>
                      {Array.isArray(item[key]) ? item[key].join(', ') : item[key]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button onClick={() => handleDelete(endpoint,item.answer_id)} style={{ backgroundColor: 'red', color: 'white' }}>
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