import { Box, List, ListItemText, ListItemIcon, Accordion, AccordionSummary, AccordionDetails, ListItemButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/system";
import { Lightbulb, Inventory } from "@mui/icons-material";
import { FileCopy } from "@mui/icons-material";
import { Email } from "@mui/icons-material";
const SidebarList = styled(List)(({ theme }) => ({
}));

const ListItemStyled = styled(ListItemButton)(({ selected }) => ({
  backgroundColor: selected ? "#005B9A" : "transparent",
  color: "#000000",
  "&:hover": {
    backgroundColor: selected ? "#005B9A" : "#D6E4F0",
  },
}));

const StudentSidebar = ({ selectedMenu, handleNavigation, period }) => {
  const ListItem = ({ label, icon, menu }) => (
    <ListItemStyled selected={selectedMenu === menu} onClick={() => handleNavigation(menu)}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemStyled>
  );

  return (
    <Box>
      <SidebarList>
        <Accordion defaultExpanded disableGutters elevation={0} >
          <AccordionSummary>
            <ListItem label="Tus Entregas" icon={<FileCopy />} menu="/deliveries"/>
          </AccordionSummary>
        </Accordion>
        <Accordion defaultExpanded disableGutters elevation={0} >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ListItemText primary="Explorar ideas de estudiantes"/>
          </AccordionSummary>
          <AccordionDetails>
            <ListItem label="Ideas de Estudiantes" icon={<Lightbulb />} menu="/explore/ideas"/>
            <ListItem label="Contactar Tutores" icon={<Email />} menu="/explore/tutor-emails"/>
            <ListItem label="Trabajos Anteriores" icon={<Inventory />} menu="/public"/>
          </AccordionDetails>
        </Accordion>
      </SidebarList>
    </Box>
  );
};

export default StudentSidebar;
