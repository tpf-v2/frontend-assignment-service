import React from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Paper,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import { useSelector, useDispatch } from "react-redux";
import { togglePeriodSetting } from "../../redux/slices/periodSlice";
import updatePeriod from "../../api/updatePeriod";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: "#f0f0f0",
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: "8px",
  boxShadow: theme.shadows[3],
}));

const CuatrimestreConfig = () => {
  const settings = useSelector((state) => state.period); // Ajuste para obtener el estado de Redux
  const dispatch = useDispatch(); // Si quieres manejar el estado con Redux
  const user = useSelector((state) => state.user);

  const handleToggle = async (field) => {
    dispatch(togglePeriodSetting({ field }));
    // Prepara el payload con el campo modificado
    const updatedSettings = {
      id: settings.id,
      ...settings,
      [field]: !settings[field],
    };

    try {
      // Llama a la función separada que realiza la petición
      await updatePeriod(updatedSettings, user);
    } catch (error) {
      console.error("Error in update:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, marginBottom: 3 }}>
      <Divider sx={{ mb: 3 }} />

      <Typography variant="h5" align="center" gutterBottom>
        Configuración del Cuatrimestre
      </Typography>
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
            <StyledTableCell align="left">Entregas de Equipos</StyledTableCell> {/* Left title */}
            <StyledTableCell align="right">Deshabilitar/Habilitar</StyledTableCell>   
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Mapea los campos del estado y crea una fila por cada uno */}
            <TableRow>
              <TableCell>Formulario de Preferencia de Temas</TableCell>
              <TableCell align="right">
                <Switch
                  checked={settings.form_active}
                  onChange={() => handleToggle("form_active")}
                  color="primary"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Entrega de Anteproyecto</TableCell>
              <TableCell align="right">
                <Switch
                  checked={settings.initial_project_active}
                  onChange={() => handleToggle("initial_project_active")}
                  color="primary"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Entrega Intermedia</TableCell>
              <TableCell align="right">
                <Switch
                  checked={settings.intermediate_project_active}
                  onChange={() => handleToggle("intermediate_project_active")}
                  color="primary"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Disponibilidades de presentación</TableCell> 
              <TableCell align="right">
                <Switch
                  checked={settings.presentation_dates_available}
                  onChange={() => handleToggle("presentation_dates_available")}
                  color="primary"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Entrega Final</TableCell> 
              <TableCell align="right">
                <Switch
                  checked={settings.final_project_active}
                  onChange={() => handleToggle("final_project_active")}
                  color="primary"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Container>
  );
};

export default CuatrimestreConfig;
