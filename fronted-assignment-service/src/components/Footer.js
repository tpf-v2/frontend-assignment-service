import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ mt: 5, py: 3, bgcolor: 'primary.main', color: 'white' }}>
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          &copy; {new Date().getFullYear()} FIUBA App
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;