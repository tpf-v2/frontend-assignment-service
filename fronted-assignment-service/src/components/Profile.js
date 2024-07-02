import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const Profile = ({ user }) => {
  return (
    <Container maxWidth="sm">
      <Paper style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Perfil del Usuario
        </Typography>
        <Box>
          <Typography variant="body1"><strong>Nombre:</strong> {user.name}</Typography>
          <Typography variant="body1"><strong>Apellido:</strong> {user.lastName}</Typography>
          <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;