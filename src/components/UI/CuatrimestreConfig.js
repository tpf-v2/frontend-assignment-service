import React, { useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Paper,
  Box,
  Button,
  Divider
} from '@mui/material';
import { styled } from '@mui/system';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: '#f0f0f0',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: '8px',
  boxShadow: theme.shadows[3],
}));

const CuatrimestreConfig = () => {
  const [settings, setSettings] = useState([
    { id: 1, name: 'Inscripciones de grupos', enabled: true },
    { id: 2, name: 'Entrega de anteproyecto', enabled: false },
    { id: 3, name: 'Entrega intermedia', enabled: false },
    { id: 4, name: 'Inscripción a fechas de presentación', enabled: false },
  ]);

  const handleToggle = (id) => {
    setSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Configuración del Cuatrimestre
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Configuración</StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {settings.map(setting => (
              <TableRow key={setting.id}>
                <TableCell>{setting.name}</TableCell>
                <TableCell align="right">
                  <Switch
                    checked={setting.enabled}
                    onChange={() => handleToggle(setting.id)}
                    color="primary"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="contained" color="primary" onClick={() => alert("Configuraciones guardadas!")}> 
          Guardar
        </Button>
      </Box>
    </Container>
  );
};

export default CuatrimestreConfig;