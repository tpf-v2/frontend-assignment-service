import React, { useEffect, useState } from 'react';
import { Container, Box, Card, CardContent, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPeriods, addPeriod } from '../../api/handlePeriods'
import MySnackbar from '../../components/UI/MySnackBar';
import { setPeriod } from '../../redux/slices/periodSlice';
import { AddCardStyled } from '../../styles/AddCardStyled';

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

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.primary.main,
}));

const years = [new Date().getFullYear()-1, new Date().getFullYear(), new Date().getFullYear()+1, new Date().getFullYear()+2];
const terms = ['1', '2'];

const AdminHomeView = () => {
  const user = useSelector((state) => state.user);
  const [periods, setPeriods] = useState([]);
  const [open, setOpen] = useState(false);
  const [newPeriod, setNewPeriod] = useState({ year: '', term: '' });
  const navigate = useNavigate();

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllPeriods(user);
        const sortedData = data.sort((a, b) => {
          const [termA, yearA] = [parseInt(a.id[0]), parseInt(a.id.slice(2))];
          const [termB, yearB] = [parseInt(b.id[0]), parseInt(b.id.slice(2))];
          
          if (yearA === yearB) {
            return termA - termB; // Si el año es igual, compara por cuatrimestre
          }
          return yearA - yearB; // Si el año es diferente, ordena por año
        });        
        setPeriods(sortedData);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  const handleAddPeriod = async () => {
    if (newPeriod.year && newPeriod.term) {
      const newEntry = `${newPeriod.term}C${newPeriod.year}`;
      try {
        const newPeriod = await addPeriod(newEntry, user); // Call the add function
        setPeriods([...periods, newPeriod]);
        handleClose();
        setNotification({
          open: true,
          message: "Cuatrimestre creado exitosamente!",
          status: "success",
        });
      } catch (error) {
        setNotification({
          open: true,
          message: "Cuatrimestre ya existente",
          status: "error",
        });
      }
    }
  };
  const dispatch = useDispatch();

  const handleCardClick = (period) => {
    dispatch(setPeriod(period))
    navigate(`/dashboard/${period.id}`);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewPeriod({ year: '', term: '' });
  };

  return (
    <Root maxWidth="md">
      <Title variant="h4">Bienvenido, Admin!</Title>
      <Typography variant="h5" style={{ color: '#555' }}>Cuatrimestres</Typography>
      <CardContainer>
        {periods.map((period, index) => (
          <CardStyled key={index} onClick={() => handleCardClick(period)}>
            <CardContent>
              <Typography variant="h6" style={{ color: '#333' }}>{period.id}</Typography>
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
              value={newPeriod.year}
              onChange={(e) => setNewPeriod({ ...newPeriod, year: e.target.value })}
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
              value={newPeriod.term}
              onChange={(e) => setNewPeriod({ ...newPeriod, term: e.target.value })}
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
          <Button onClick={handleAddPeriod} color="primary">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
      <MySnackbar
        open={notification.open}
        handleClose={handleSnackbarClose}
        message={notification.message}
        status={notification.status}
      />
    </Root>
  );
};

export default AdminHomeView;