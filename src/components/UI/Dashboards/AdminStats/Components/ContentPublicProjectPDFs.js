import {
  Box,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Paper,
  IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const ContentPublicPdfProjects = ({
  loadingProjects,
  deliveries,
  downloadFile,
  projectType,
}) => {
  if (loadingProjects) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table stickyHeader>
          <TableBody>
            {loadingProjects ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              deliveries.length ? (
                deliveries.map((entrega, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <IconButton
                        onClick={() => downloadFile(entrega.project.id, entrega.group_number)}
                      >
                      <DownloadIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell style={{overflowWrap: "anywhere"}}>
                      <h2>
                      {
                        entrega.project?.final_report_title || `Proyecto Final Equipo ${entrega.group_number}`
                      }
                      </h2>
                      <p>{
                        "Integrantes: " + entrega.project.students.map((student) => {
                          return student.name + " " + student.last_name
                        }).join(", ")
                      }</p>
                      <p>{ "Tutor: " + entrega.project.tutor_name.name + " " + entrega.project.tutor_name.last_name }</p>
                      <p style={entrega.project.final_report_summary ? {} : { fontStyle: 'italic' }}>
                      { 
                          entrega.project.final_report_summary
                          ? entrega.project.final_report_summary 
                          : "Sin descripción"
                      }
                      </p>
                    </TableCell>
                  </TableRow>
                ))
              ) : <h2 style={{padding: "20px", fontStyle: 'italic'}}>No se encontraron entregas.</h2>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ContentPublicPdfProjects;
