import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 275,
  boxShadow: theme.shadows[5],
}));

const StudentInfo = ({ user }) => {
  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Información del Estudiante
        </Typography>
        <Typography color="text.secondary">
          Nombre: {user.name}
        </Typography>
        <Typography color="text.secondary">
          Rol: {user.role}
        </Typography>
        <Typography color="text.secondary">
          Padrón: {user.registration}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default StudentInfo;