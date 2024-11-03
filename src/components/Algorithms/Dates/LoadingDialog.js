import React from "react";
import { Dialog, DialogTitle, DialogContent, Box, CircularProgress, Typography } from "@mui/material";

const LoadingDialog = ({ open, setOpenDialog, loading }) => (
//   <Dialog open={open} maxWidth="lg" fullWidth>
//     <DialogTitle>{!loading ? "Fechas de Presentación Asignadas" : ""}</DialogTitle>
//     <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
//       {loading && (
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <CircularProgress />
//           <Typography sx={{ ml: 2 }}>Asignando Fechas de Presentación...</Typography>
//         </Box>
//       )}
//     </DialogContent>
//   </Dialog>
<Dialog
open={open}
onClose={() => setOpenDialog(false)}
maxWidth="lg"
fullWidth
sx={{
  height: "100%",
  maxHeight: "100vh",
}}
>
<DialogTitle>
  {!loading && "Fechas de Presentación Asignadas"}
</DialogTitle>
<DialogContent
  sx={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    minHeight: "300px",
    maxHeight: "100vh",
    minWidth: "300px",
  }}
>
  {loading && (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
      }}
    >
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>
        Asignando Fechas de Presentación...
      </Typography>
    </Box>
  )}
</DialogContent>
</Dialog>
);

export default LoadingDialog;
