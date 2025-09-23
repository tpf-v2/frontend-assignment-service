import React from "react";
import { Grid, Typography } from "@mui/material";

const AlgorithmPreCheck = ({initialDescription, inputInfo, msg}) => (
  <>
    <Grid item xs={12} md={12} sx={{ display: "flex" }}>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Verificación previa
      </Typography>
    </Grid>
    {inputInfo && (
      <>
      <Grid item xs={12} md={12} sx={{ display: "flex" }}>
        <Typography variant="body1" sx={{ textAlign: "justify" }}>
          {initialDescription}
        </Typography>
      </Grid>
      <Grid item xs={12} md={12} sx={{ display: "flex" }}>  
        <Typography variant="body1" sx={{ textAlign: "justify" }}>
          Existen {inputInfo.length} {msg}.
        </Typography>
      </Grid>
      </>
    )}
  </>
);

export default AlgorithmPreCheck;
