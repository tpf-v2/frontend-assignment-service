import React from 'react';
import { Paper, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';


const StatCardStyled = styled(Paper)(({ theme, selected, onClick }) => ({
  // (La sintaxis de acá arriba indica que propaga las props a Paper (ej onClick);
  // para explicitar una debajo como selected u onClick, hay que escribirla acá arriba.=

  flex: '1 1 30%',
  margin: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  textAlign: 'center',
  
  // Lo siguiente solo se aplica si se le pasó onClick, para no cambiar ux en lugares en los que es clickeable
  ...(onClick && {
    // Mostrar a la tarjeta como clickeable (sin esto lo es, pero no se nota desde ui)
    cursor: 'pointer',
    // Un efecto de sombra por detrás cuando se hace hover
    transition: 'box-shadow 0.2s ease-in-out',
    '&:hover': {
      boxShadow: theme.shadows[7],
    },
    
    // Recibo selected y pongo un indicador visual (borde inferior) según su valor
    borderBottom: selected ? `4px solid #0072C6` : '4px solid transparent',
    '&:hover': {
      boxShadow: theme.shadows[6],
    },
  }),    
  
}));


const StatCard = ({ title, value, onClick, selected }) => {
  return (
    <StatCardStyled onClick={onClick} selected={selected}>
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