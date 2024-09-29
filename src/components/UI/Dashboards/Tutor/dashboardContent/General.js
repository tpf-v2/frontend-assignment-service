import React from "react";
import { Box, Grid, Typography, Container } from "@mui/material";
import { useSelector } from "react-redux";


const General = () => {
  const user = useSelector((state) => state.user);
  
  return (
    <Container maxWidth="lg" sx={{ display: "flex", mt: 5 }}>
      <Box sx={{ flex: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Información General
        </Typography>
        {/* <Typography variant="h1" align="center" gutterBottom>
          TO BE DEFINED
        </Typography> */}
        <Box mt={4}>
      </Box>
      </Box>
    </Container>
  );
};
export default General;