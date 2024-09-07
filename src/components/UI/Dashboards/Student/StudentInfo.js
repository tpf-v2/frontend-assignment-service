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
          Bienvenido, {user.name}!
        </Typography>
        <Typography color="text.secondary">
          Número de grupo: {user.group || "TBD"}
        </Typography>
        <Typography color="text.secondary">
          Tema: {user.topic || "TBD"}
        </Typography>
        <Typography color="text.secondary">
          Tutor: {user.tutor || "TBD"}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default StudentInfo;