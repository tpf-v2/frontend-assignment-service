import React from "react";
import { Box, Typography, ListItem, List, Accordion, AccordionSummary, AccordionDetails, Divider } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/system";

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: "#0072C6",
  textAlign: "center",
  fontSize: "2rem",
  fontWeight: "bold",
  flexGrow: 1,
}));

const SidebarList = styled(List)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const ListItemStyled = styled(ListItem)(({ theme, selected }) => ({
  backgroundColor: selected ? "#005B9A" : "transparent",
  color: "#000000",
  "&:hover": {
    backgroundColor: selected ? "#005B9A" : "#D6E4F0",
  },
}));

const SidebarContainer = styled(Box)(({ theme }) => ({
  paddingRight: theme.spacing(3),
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const Sidebar = ({ selectedMenu, handleNavigation, period }) => {
  return (
    <SidebarContainer>
      <Title variant="h4">{period}</Title>
      <SidebarList>
        {/* Botón no desplegable */}
        <ListItemStyled
          button
          selected={selectedMenu === "Inicio"}
          onClick={() => handleNavigation("Inicio")}
        >
          Inicio
        </ListItemStyled>
        <Divider />
        <ListItemStyled
          button
          selected={selectedMenu === "Inscripciones"}
          onClick={() => handleNavigation("Inscripciones")}
        >
          Inscripciones
        </ListItemStyled>
        <Divider />
        <ListItemStyled
          button
          selected={selectedMenu === "Disponibilidad fechas de Presentación"}
          onClick={() => handleNavigation("Disponibilidad fechas de Presentación")}
        >
          Disponibilidad Fechas de Presentación
        </ListItemStyled>
        <Divider />
        {/* Asignaciones - Desplegable */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Algoritmos de Asignación
          </AccordionSummary>
          <AccordionDetails>
            <ListItemStyled
              button
              selected={selectedMenu === "Equipos"}
              onClick={() => handleNavigation("Equipos")}
            >
              Completar Equipos
            </ListItemStyled>
            <ListItemStyled
              button
              selected={selectedMenu === "Temas - Tutores - Equipos"}
              onClick={() => handleNavigation("Temas - Tutores - Equipos")}
            >
              Temas y Tutores
            </ListItemStyled>
            <ListItemStyled
              button
              selected={selectedMenu === "Fechas de presentación"}
              onClick={() => handleNavigation("Fechas de presentación")}
            >
              Fechas de Presentación
            </ListItemStyled>
          </AccordionDetails>
        </Accordion>
        {/* Entregas - Desplegable */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Entregas de Equipos
          </AccordionSummary>
          <AccordionDetails>
            <ListItemStyled
              button
              selected={selectedMenu === "Anteproyecto"}
              onClick={() => handleNavigation("Anteproyecto")}
            >
              Anteproyecto
            </ListItemStyled>
            <ListItemStyled
              button
              selected={selectedMenu === "Intermedia"}
              onClick={() => handleNavigation("Intermedia")}
            >
              Intermedia
            </ListItemStyled>
            <ListItemStyled
              button
              selected={selectedMenu === "Final"}
              onClick={() => handleNavigation("Final")}
            >
              Final
            </ListItemStyled>
          </AccordionDetails>
        </Accordion>
      </SidebarList>
      </SidebarContainer>
  );
};

export default Sidebar;
