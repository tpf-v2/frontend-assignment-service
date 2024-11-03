import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Box } from '@mui/material';
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

const ParentTable = ({ title, columns, rowKeys, endpoint, renderRow, AddButtonComponent, items}) => {
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

  const unnestKeys = (obj, parentKey = '', result = {}) => {
    for (const [key, value] of Object.entries(obj)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key; 
  
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        unnestKeys(value, newKey, result);
      } else {
        result[newKey] = value;
      }
    }
  
    return result;
  };

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
      const unnestedItem = unnestKeys(item);
      const row = columns.map(column => {
        const value = unnestedItem[rowKeys[column]]; // Obtener el valor
    
        // Verificar si el valor es un array
        if (Array.isArray(value)) {
          return value.join(' || ').replace(/,/g, ' '); // Unir los elementos del array usando ';'
        }
        
        return value.replace(/,/g, ' ')
      }).join(',');
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

  // Filtrado mejorado
  const filteredData = data.filter(item => {
    console.log(item)
    return columns.some(column => {
      const unnestedItem = unnestKeys(item);
      const itemValue = unnestedItem[rowKeys[column]] || ''; // Utiliza el mapeo
      return String(itemValue).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  if (loading) return <Typography variant="h6">Cargando...</Typography>;
  const topicsCond = title === "Temas" ? items.length > 0 : true;

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
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Button variant="contained" color="primary" onClick={downloadCSV}>
          Descargar como CSV
        </Button>
        {(AddButtonComponent && topicsCond) && <AddButtonComponent />}
      </Box>
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
                  {renderRow(item, rowKeys)}
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