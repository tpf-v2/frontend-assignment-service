import { Box, List, ListItemText, ListItemIcon, Accordion, AccordionSummary, AccordionDetails, Divider, ListItemButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/system";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

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

const SidebarContainer = styled(Box)(({ theme }) => ({}));

const StudentSidebar = ({ selectedMenu, handleNavigation, period }) => {
  const ListItem = ({ label, icon, menu }) => (
    <ListItemStyled selected={selectedMenu === menu} onClick={() => handleNavigation(menu)}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemStyled>
  );

  return (
    <SidebarContainer>
      <SidebarList>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ListItemText primary="Explorar Ideas" />
          </AccordionSummary>
          <AccordionDetails>
            <ListItem label="Ideas de Estudiantes" icon={<GroupAddIcon />} menu="/explore/ideas"/>
            <ListItem label="Mails de Tutores" icon={<CompareArrowsIcon />} menu="/explore/tutor-emails"/>
          </AccordionDetails>
        </Accordion>
      </SidebarList>
    </SidebarContainer>
  );
};

export default StudentSidebar;
