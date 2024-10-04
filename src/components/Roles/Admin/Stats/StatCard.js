import React from 'react';
import { Paper, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

const StatCardStyled = styled(Paper)(({ theme }) => ({
  flex: '1 1 30%',
  margin: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  textAlign: 'center',
}));

const StatCard = ({ title, value }) => {
  return (
    <StatCardStyled>
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