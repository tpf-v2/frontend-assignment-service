import React, { useEffect, useState } from 'react';
import { Container, Box, Card, CardContent, Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import {getTutorCuatrimestre } from '../../api/handlePeriods'
import MySnackbar from '../../components/UI/MySnackBar';
import { setPeriod } from '../../redux/slices/periodSlice';

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


const TutorHomeView = () => {
  const user = useSelector((state) => state.user);
  const [periods, setCuatrimestres] = useState([]);
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
        const data = await getTutorCuatrimestre(user);
        
        const sortedData = data.sort((a, b) => b.id - a.id);
      
        setCuatrimestres(sortedData);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

  const dispatch = useDispatch();

  const handleCardClick = (period) => {
    dispatch(setPeriod(period))
    navigate(`/tutor-period/${period.period_id}`);
  };

  return (
    <Root maxWidth="md">
      <Title variant="h4">Bienvenido, {user.name}!</Title>
      <Typography variant="h5" style={{ color: '#555' }}>Cuatrimestres</Typography>
      <CardContainer>
        {periods.map((period, index) => (
          <CardStyled key={index} onClick={() => handleCardClick(period)}>
            <CardContent>
              <Typography variant="h6" style={{ color: '#333' }}>{period.period_id}</Typography>
            </CardContent>
          </CardStyled>
        ))}
      </CardContainer>
      <MySnackbar
        open={notification.open}
        handleClose={handleSnackbarClose}
        message={notification.message}
        status={notification.status}
      />
    </Root>
  );
};

export default TutorHomeView;