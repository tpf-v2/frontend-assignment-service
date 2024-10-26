import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField } from '@mui/material';
import { styled } from '@mui/system';
import { getTableData, deleteRow } from '../../../api/handleTableData';
import { useSelector } from 'react-redux';

const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#ffffff',
  boxShadow: theme.shadows[3],
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: '#0072C6',
  textAlign: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
}));

const ParentTable = ({ title, columns, endpoint, renderRow }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await getTableData(endpoint, user);
        setData(responseData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, user]);

  const handleDelete = async (id) => {
    try {
      await deleteRow(endpoint, id, user);
      setData(prevData => prevData.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const downloadCSV = () => {
    const csvRows = [];
    
    // Headers
    csvRows.push(columns.join(','));
  
    // Data
    data.forEach(item => {
      const row = Object.values(item).join(',');
      csvRows.push(row);
    });
  
    // Crear un blob y descargar
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'table_data.csv');
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredData = data.filter(item => {
    return columns.some(column => {
      return String(item[column.toLowerCase()]).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  if (loading) return <Typography variant="h6">Cargando...</Typography>;

  return (
    <Container maxWidth="lg">
      <Root>
        <Title variant="h4">{title}</Title>

        <TextField 
          label="Buscar"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          style={{ marginBottom: '20px' }}
        />

        <Button variant="contained" color="primary" onClick={downloadCSV} style={{ marginBottom: '20px' }}>
          Descargar como CSV
        </Button>
        
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
              {filteredData.map((item) => (
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