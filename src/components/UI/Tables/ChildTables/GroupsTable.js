import React from "react";
import { useSelector } from "react-redux";
import { Paper, Typography } from "@mui/material";
import { Container, styled } from "@mui/system";
import TeamDataTable from "../../../Algorithms/GroupDataTable";

const TeamsTable = ({dataListToRender=[]}) => {
  const title = "Equipos";
  const period = useSelector((state) => state.period);
  const endpoint = `/groups/?period=${period.id}`;

  const teams = Object.values(useSelector((state) => state.groups))
  .sort((a, b) => a.group_number - b.group_number)
  .map(({ version, rehydrated, ...rest }) => rest)
  .filter((item) => Object.keys(item).length > 0);

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


  // Si tiene elementos, la estoy llamando para la Verificación previa a algoritmos,
  // y no quiero que haga ningún fetch
  if (!dataListToRender) return;
  console.log("---- datalistToRender:", dataListToRender);
  if (dataListToRender.length > 0) {
    console.log("---- dataListToRender.length > 0");
    return (
      <Container maxWidth={false} sx={{ maxWidth: "1350px" }}>
        <Root>
          <Title variant="h4">{title}</Title>

          <TeamDataTable items={dataListToRender}/>
        </Root>
      </Container>
    );
  } if (dataListToRender.length === 0) {
    console.log("---- dataListToRender.length === 0");
    // Si está vacía, es el uso por defecto que ya existía, es para mostrar tabla de Estudiantes
    return (
      <Container maxWidth={false} sx={{ maxWidth: "1350px" }}>
        <Root>
          <Title variant="h4">{title}</Title>

          <TeamDataTable endpoint={endpoint} items={teams}/>
        </Root>
      </Container>
    );
  }
};

export default TeamsTable;
