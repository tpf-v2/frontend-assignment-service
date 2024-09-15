import React from "react";
import ParentTable from "../ParentTable";
import { Paper, TableCell, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { Container, styled } from "@mui/system";
import GroupDataTable from "../../../Algorithms/GroupDataTable";

const GroupsTable = () => {
  // const { cuatrimestre } = useParams(); // Captura del cuatrimestre
  // const endpoint = `/groups/?period=${cuatrimestre}`;
  const title = "Grupos";
  // const columns = ['ID', 'Emails']; // Specify your column names here

  // const renderRow = (item) => (
  //   <>
  //     <TableCell>{item.id}</TableCell>
  //     <TableCell>
  //       {item.students.map(student => student.email).join(', ')} {/* Mapea el array para mostrar los emails */}
  //     </TableCell>
  //   </>
  // );

  const Title = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    color: "#0072C6",
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: "bold",
  }));
  // Estilos
  const Root = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(4),
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#ffffff",
    boxShadow: theme.shadows[3],
  }));
  return (
    // <ParentTable title={title} columns={columns} endpoint={endpoint} renderRow={renderRow} />
    <Container maxWidth="lg">
      <Root>
        <Title variant="h4">{title}</Title>

        <GroupDataTable />
      </Root>
    </Container>
  );
};

export default GroupsTable;
