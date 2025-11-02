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
import { FlexGrowSubtitle } from "../../../../../styles/Titles";
import { useState } from "react";

const ContentPublicPdfProjects = ({
  loadingProjects,
  deliveries,
  downloadFile,
  projectType,
}) => {
  const [downloading, setDownloading] = useState(null)
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

  let periods = [...new Set(deliveries.map(entrega => entrega.period_id))]
  console.log(periods)
  return (
    <div>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table stickyHeader>
          <TableBody>
            {
              deliveries.length ? (
                periods.map(period => (
                  <div>
                    <FlexGrowSubtitle padding="1em">{period.substring(2) + " - Cuatrimestre " + period[0] + "º"}</FlexGrowSubtitle>
                    {
                    deliveries.filter(delivery => delivery.period_id == period).map((entrega, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <IconButton
                            onClick={async () => {
                              console.log("Not Done")
                              setDownloading(entrega.project.id)
                              await downloadFile(entrega.project.id, entrega.group_number, entrega.period_id)
                              setDownloading(null)
                              console.log("Done")
                            }}
                          >
                            {(downloading === entrega.project.id) ? <CircularProgress /> : (<DownloadIcon />)}
                          </IconButton>
                        </TableCell>
                        <TableCell style={{overflowWrap: "anywhere"}}>
                          <h2>
                          {
                            entrega.project?.final_report_title || `Proyecto Final Equipo ${entrega.group_number}`
                          }
                          </h2>
                          <p>{
                            "Integrantes: " + entrega.project.students.map((student) => (
                              student.name + " " + student.last_name
                            )).join(", ")
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
                    }

                  </div>

                ))
              ) : <h2 style={{padding: "20px", fontStyle: 'italic'}}>No se encontraron entregas.</h2>
            }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ContentPublicPdfProjects;
