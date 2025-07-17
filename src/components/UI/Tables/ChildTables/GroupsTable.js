import React from "react";
import { Paper, Typography } from "@mui/material";
import { Container, styled } from "@mui/system";
import GroupDataTable from "../../../Algorithms/GroupDataTable";

const GroupsTable = () => {
  const title = "Equipos";

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
    <Container maxWidth={false} sx={{ maxWidth: "1350px" }}>
      <Root>
        <Title variant="h4">{title}</Title>

        <GroupDataTable />
      </Root>
    </Container>
  );
};

export default GroupsTable;
