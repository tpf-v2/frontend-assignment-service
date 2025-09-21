import React from 'react';
import { Paper, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';


const StatCardStyled = styled(Paper)(({ theme }) => ({
  // La sintaxis de acá arriba indica que propaga las props a Paper, por lo que puede usar onClick
  flex: '1 1 30%',
  margin: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  textAlign: 'center',
  // Mostrar a la tarjeta como clickeable (sin esto lo es, pero no se nota desde ui)
  cursor: 'pointer',
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));


const StatCard = ({ title, value, onClick }) => {
  return (
    <StatCardStyled onClick={onClick}>
      <Typography variant="h6">{title}</Typography>
      {value === -1 ? (
        <CircularProgress />
      ) : (
        <Typography variant="h3" color="#0072C6">{value}</Typography>
      )}
    </StatCardStyled>
  );
};

export default StatCard;