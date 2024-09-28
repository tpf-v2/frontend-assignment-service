import React from "react";
import { Box, Typography, ListItem, List, Divider, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
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

const Sidebar = ({ selectedMenu, handleNavigation, cuatrimestre }) => {
  return (
    <SidebarContainer>
              <Title variant="h4">{cuatrimestre}</Title>
              <SidebarList>
                <ListItemStyled
                  button
                  selected={selectedMenu === "General"}
                  onClick={() => handleNavigation("General")}
                >
                  General
                </ListItemStyled>
                <Divider /> {/* Divider después de General */}
                {/* Asignaciones - Desplegable */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Asignaciones
                  </AccordionSummary>
                  <AccordionDetails>
                    <ListItemStyled
                      button
                      selected={selectedMenu === "Inscripciones"}
                      onClick={() => handleNavigation("Inscripciones")}
                    >
                      Inscripciones
                    </ListItemStyled>
                    <ListItemStyled
                      button
                      selected={selectedMenu === "Fechas de presentación"}
                      onClick={() => handleNavigation("Fechas de presentación")}
                    >
                      Fechas
                    </ListItemStyled>
                    <ListItemStyled
                      button
                      selected={selectedMenu === "Algoritmos"}
                      onClick={() => handleNavigation("Algoritmos")}
                    >
                      Algoritmos
                    </ListItemStyled>
                  </AccordionDetails>
                </Accordion>
                {/* Entregas - Desplegable */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Entregas
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
