import React from "react";
import { Box, Button, Grid } from "@mui/material";
import StatCard from "./StatCard"; // Asegúrate de tener este componente
import { styled } from "@mui/system";
import { useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper } from "@mui/material";
import { formatDate } from "../../../../../utils/getEntitiesUtils";
import { downloadPPSReport } from "../../../../../api/handleProjects";
import { useSelector } from "react-redux";

const ButtonStyled = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  width: "48%",
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  backgroundColor: "#0072C6",
  color: "#ffffff",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: "#005B9A",
  },
}));

const ContentPPS = ({ students, deliveries, loadingPPS }) => {
    const [selectedEntregaron, setSelectedEntregaron] = useState(true);
    const [selectedNoEntregaron, setSelectedNoEntregaron] = useState(false);
    const period = useSelector((state) => state.period);
    const user = useSelector((state) => state.user);

    if (!deliveries) {
        deliveries = [];
    }

    const studentArray = Object.keys(students).map(index => students[index]);

    function downloadFile(student_id) {
        const studentNumber = getStudentNumber(student_id);
        downloadPPSReport(user, student_id, period.id, 'informe_pps_estudiante_' + studentNumber + '.pdf');
    }

    function getStudentNumber(id) {
        const student = studentArray.filter(student => student.id === id)[0];
        return student?.student_number;
    }

    function getStudentFullName(id) {
        const student = studentArray.filter(student => student.id === id)[0];
        if (student) {
            return student.last_name + ', ' + student.name;
        } else {
            return '?';
        }
    }

    return (
        <div>
            <Box mt={4}>
            {/* Tarjetas con cantidades */}
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                <StatCard
                    title="Estudiantes que entregaron"
                    value={loadingPPS ? -1 : deliveries.length}
                    onClick={() => {setSelectedEntregaron(true); setSelectedNoEntregaron(false)}} 
                    selected={selectedEntregaron}
                />
                </Grid>
                <Grid item xs={12} sm={4}>
                <StatCard
                    title="Estudiantes que faltan entregar"
                    value={
                    loadingPPS ? -1 : studentArray.length - deliveries.length
                    }
                    onClick={() => {setSelectedEntregaron(false); setSelectedNoEntregaron(true)}}
                    selected={selectedNoEntregaron}
                />
                </Grid>
                <Grid item xs={12} sm={4}>
                <StatCard
                    title="Total de estudiantes"
                    value={loadingPPS ? -1 : studentArray.length}
                    onClick={() => {setSelectedEntregaron(true); setSelectedNoEntregaron(true)}}
                    selected={selectedEntregaron && selectedNoEntregaron}
                />
                </Grid>
            </Grid>
            </Box>

            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Numero</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Fecha de Entrega</TableCell>
                            <TableCell>Descargar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { selectedEntregaron && (
                            deliveries.map((delivery) => (
                                <TableRow key={'delivery-'+delivery.id}>
                                    <TableCell>{getStudentNumber(delivery.student_id)}</TableCell>
                                    <TableCell>{getStudentFullName(delivery.student_id)}</TableCell>
                                    <TableCell>{formatDate(delivery.created_on)}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => downloadFile(delivery.student_id)}
                                        >
                                            <DownloadIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                        )))}

                        { selectedNoEntregaron && (
                            studentArray.map((student) => (
                                <TableRow key={'student-'+student.id}>
                                    <TableCell>{student.student_number}</TableCell>
                                    <TableCell>{getStudentFullName(student.id)}</TableCell>
                                    <TableCell> - </TableCell>
                                    <TableCell>
                                        <IconButton
                                            disabled
                                        >
                                            <DownloadIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

            </TableContainer>
        </div>
    )
};

export default ContentPPS;
