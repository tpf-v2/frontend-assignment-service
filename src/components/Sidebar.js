import React from "react";
import { Box, Typography, List, ListItemText, ListItemIcon, Accordion, AccordionSummary, AccordionDetails, Divider, ListItemButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/system";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import TodayIcon from '@mui/icons-material/Today';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import TimelineIcon from '@mui/icons-material/Timeline';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: 0,
  color: "#0072C6",
  textAlign: "center",
  fontSize: "2rem",
  fontWeight: "bold",
  flexGrow: 1,
}));

const TitleTop = styled(Typography)(({ theme }) => ({
  color: "#0072C6",
  textAlign: "center",
  fontSize: "1rem",
  fontWeight: "bold",
  flexGrow: 1,
  overflowWrap: "break-word",
}));

const SidebarList = styled(List)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const ListItemStyled = styled(ListItemButton)(({ selected }) => ({
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
  const ListItem = ({ label, icon, menu }) => (
    <ListItemStyled selected={selectedMenu === menu} onClick={() => handleNavigation(menu)}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemStyled>
  );

  const periodParts = period.split("C")
  const prettyPeriod = "Cuatrimestre " + periodParts[0] + "º"
  const prettyPeriodYear = periodParts[1]

  return (
    <SidebarContainer>
      <TitleTop variant="h4">{prettyPeriod}</TitleTop>
      <Title variant="h3">{prettyPeriodYear}</Title>
      <SidebarList>
        {/* Botón no desplegable */}
        <ListItem label="Inicio" icon={<HomeIcon />} menu="Inicio" />
        <Divider />
        <ListItem label="Inscripciones" icon={<EditNoteIcon />} menu="Inscripciones"/>
        <Divider />
        <ListItem label="Disponibilidad Fechas de Presentación" icon={<CalendarMonthIcon />} menu="Disponibilidad fechas de Presentación" />
        <Divider />
        {/* Asignaciones - Desplegable */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ListItemText primary="Algoritmos de Asignación" />
          </AccordionSummary>
          <AccordionDetails>
            <ListItem label="Completar Equipos" icon={<GroupAddIcon />} menu="Equipos"/>
            <ListItem label="Temas y Tutores" icon={<CompareArrowsIcon />} menu="Temas - Tutores - Equipos"/>
            <ListItem label="Fechas de Presentación" icon={<TodayIcon />} menu="Fechas de presentación"/>
          </AccordionDetails>
        </Accordion>
        {/* Entregas - Desplegable */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ListItemText primary="Entregas de Equipos" />
          </AccordionSummary>
          <AccordionDetails>
            <ListItem label="Anteproyecto" icon={<EmojiFlagsIcon />} menu="Anteproyecto"/>
            <ListItem label="Intermedia" icon={<TimelineIcon />} menu="Intermedia"/>
            <ListItem label="Final" icon={<SchoolIcon />} menu="Final"/>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Entregas Individuales
          </AccordionSummary>
          <AccordionDetails>
            <ListItemStyled
              button
              selected={selectedMenu === "PPS"}
              onClick={() => handleNavigation("PPS")}
            >
              Informe de Cumplimiento PPS
            </ListItemStyled>
          </AccordionDetails>
        </Accordion>

      </SidebarList>
      </SidebarContainer>
  );
};

export default Sidebar;
