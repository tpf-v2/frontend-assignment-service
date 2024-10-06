import { Button, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";

const TopicTutor = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} sx={{ display: "flex" }}>
          <Paper elevation={3} sx={{ padding: 2, flexGrow: 1 }}>
            <Typography variant="h6">Descripción</Typography>
            <Typography variant="body1">
              Este algoritmo utiliza programación lineal para formar grupos de
              estudiantes incompletos (con menos de 4 miembros) a partir de
              grupos existentes. El objetivo es combinar grupos incompletos para
              formar tantos grupos completos de 4 estudiantes como sea posible,
              maximizando el número de grupos y teniendo en cuenta las
              preferencias de temas de los estudiantes.
            </Typography>
            <Typography variant="body1">
              Este algoritmo se puede correr <strong>una única vez</strong>.
            </Typography>

            {/* Botones Correr, Editar */}
            <Grid
              item
              xs={12}
              md={12}
              sx={{ display: "flex", justifyContent: "right" }}
            >
              <Button
                variant="contained"
                color="primary"
                // onClick={handleRun}
                // disabled={period.groups_assignment_completed}
                sx={{
                  padding: "6px 26px", // Tamaño más grande del botón
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Sombra para darle protagonismo
                  transition: "all 0.3s ease", // Suavizar la transición al hover
                  marginRight: "16px",
                }}
              >
                Correr
              </Button>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default TopicTutor;
