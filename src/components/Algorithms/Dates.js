import React, { useState } from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useSelector } from "react-redux";

const Dates = () => {
    const period = useSelector((state) => state.period);

    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const handleRun = async () => {
        try {
          // Inicia la carga y abre el diálogo
          setLoading(true);
          setOpenDialog(true);
          console.log("Running the algorithm!")
        } catch (error) {
          // Manejo de errores global
          console.error("Error when running availability algorithm:", error);
        } finally {
          // Finaliza la carga independientemente de si hubo un error o no
          setLoading(false);
          setOpenDialog(false);
        }
    };
    
  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2}>
        {/* Descripción */}
        <Grid item xs={12} md={12} sx={{ display: "flex" }}>
          {/* <Paper elevation={3} sx={{ padding: 2, flexGrow: 1 }}> */}
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Descripción
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} sx={{ display: "flex" }}>
          <Typography variant="body1" sx={{ textAlign: "justify" }}>
            Este algoritmo emplea programación lineal para asignar fechas de presentación a
            grupos de estudiantes, considerando la disponibilidad de tutores y evaluadores.
            Su objetivo es garantizar que todos los grupos reciban una fecha de exposición
            dentro del rango disponible. Además, el algoritmo distribuye equitativamente la
            carga de trabajo entre los evaluadores, asegurando una asignación justa y balanceada.
          </Typography>
        </Grid>
        {/* Botones Correr */}
        <Grid
          item
          xs={12}
          md={12}
          sx={{ display: "flex", justifyContent: "right" }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleRun}
            disabled={period.presentation_dates_assignment_completed}
            sx={{
              padding: "6px 26px", // Tamaño más grande del botón
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Sombra para darle protagonismo
              transition: "all 0.3s ease", // Suavizar la transición al hover
            }}
          >
            Correr
          </Button>
        </Grid>
        {/* </Paper> */}
      </Grid>

      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
      </Grid>

      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Resultados
        </Typography>
      </Grid>

      {/* Sección de Tabla y Botón a la derecha */}
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <TableContainer
          component={Paper}
          style={{ marginTop: "20px", maxHeight: "400px", flexGrow: 1 }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Grupo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tutor</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Fecha de Presentación</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Revisor</TableCell>
              </TableRow>
            </TableHead>
            {!period.presentation_dates_assignment_completed &&
              (<TableRow>
                <TableCell colSpan={10} align="center">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography>
                      Correr el algoritmo para obtener los resultados
                    </Typography>
                  </Box>
                </TableCell>
            </TableRow>)}
            </Table>
        </TableContainer>
      </Grid>

      {/* Spinner de carga */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          height: "100%",
          maxHeight: "100vh",
        }}
      >
        <DialogTitle>{!loading && "Fechas de Presentación Asignadas"}</DialogTitle>
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
              <Typography sx={{ ml: 2 }}>Asignando Fechas de Presentación...</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      {/* </Grid> */}
    </Box>
  );
};

export default Dates;