import React, { useState } from 'react';
import { Container, Box, Paper, Card, CardContent, CardActionArea, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';

const Root = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  backgroundColor: '#E3F2FD', // Celeste FIUBA
}));

const CardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: theme.spacing(3),
  marginTop: theme.spacing(4),
}));

const CardStyled = styled(Card)(({ theme }) => ({
  width: '200px',
  height: '150px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const AddCardStyled = styled(Card)(({ theme }) => ({
  width: '200px',
  height: '150px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  border: '2px dashed #bbb',
  backgroundColor: '#f8f8f8',
  cursor: 'pointer',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.primary.main,
}));

const years = ['2024', '2025', '2026', '2027'];
const terms = ['1', '2'];

const AdminDashboard = () => {
  const user = useSelector((state) => state.user);
  const [cuatrimestres, setCuatrimestres] = useState(['2C2024']); // Ejemplo inicial
  const [open, setOpen] = useState(false);
  const [newCuatrimestre, setNewCuatrimestre] = useState({ year: '', term: '' });
  const navigate = useNavigate();

  const handleAddCuatrimestre = () => {
    if (newCuatrimestre.year && newCuatrimestre.term) {
      const newEntry = `${newCuatrimestre.term}C${newCuatrimestre.year}`;
      setCuatrimestres([...cuatrimestres, newEntry]);
      handleClose();
    }
  };

  const handleCardClick = (cuatrimestre) => {
    navigate(`/form-selection/${cuatrimestre}`);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewCuatrimestre({ year: '', term: '' });
  };

  return (
    <Root maxWidth="md">
      <Title variant="h4">Bienvenido, Admin!</Title>
      <Typography variant="h5" style={{ color: '#555' }}>Cuatrimestres</Typography>
      <CardContainer>
        {cuatrimestres.map((cuatrimestre, index) => (
          <CardStyled key={index} onClick={() => handleCardClick(cuatrimestre)}>
            <CardContent>
              <Typography variant="h6" style={{ color: '#333' }}>{cuatrimestre}</Typography>
            </CardContent>
          </CardStyled>
        ))}
        <AddCardStyled onClick={handleClickOpen}>
          <CardContent>
            <AddIcon style={{ fontSize: '2rem', color: '#888' }} />
          </CardContent>
        </AddCardStyled>
      </CardContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Agregar Nuevo Cuatrimestre</DialogTitle>
        <DialogContent>
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel>Año</InputLabel>
            <Select
              value={newCuatrimestre.year}
              onChange={(e) => setNewCuatrimestre({ ...newCuatrimestre, year: e.target.value })}
              label="Año"
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel>Cuatrimestre</InputLabel>
            <Select
              value={newCuatrimestre.term}
              onChange={(e) => setNewCuatrimestre({ ...newCuatrimestre, term: e.target.value })}
              label="Cuatrimestre"
            >
              {terms.map((term) => (
                <MenuItem key={term} value={term}>
                  {term}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAddCuatrimestre} color="primary">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Root>
  );
};

export default AdminDashboard;