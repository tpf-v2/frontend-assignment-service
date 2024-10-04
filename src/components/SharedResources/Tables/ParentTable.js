import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { styled } from '@mui/system';
import { getTableData, deleteRow } from '../../../api/handleTableData';
import { useSelector } from 'react-redux';

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

const ParentTable = ({ title, columns, endpoint, renderRow }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await getTableData(endpoint, user);
        setData(responseData); // Updates state with fetched data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Handle error
      }
    };

    fetchData();
  }, [endpoint]);

  const handleDelete = async (id) => {
    try {
      // Call deleteResponse to remove the record
      await deleteRow(endpoint, id, user); 
      // Filter the data state to remove the deleted item
      setData(prevData => prevData.filter(item => item.id !== id)); 
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  
  if (loading) return <Typography variant="h6">Cargando...</Typography>;

  return (
    <Container maxWidth="lg">
      <Root>
        <Title variant="h4">{title}</Title>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell key={index}>{column}</TableCell>
                ))}
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  {renderRow(item)}
                  <TableCell>
                    <Button onClick={() => handleDelete(item.id)} style={{ backgroundColor: 'red', color: 'white' }}>
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

export default ParentTable;