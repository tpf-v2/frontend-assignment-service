import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";
import { ClosedErrorAlert } from "../../../ClosedErrorAlert";

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 275,
  boxShadow: theme.shadows[5],
}));

const StudentInfo = ({infoError}) => {
  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.user.period_id);
  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
        ¡{user.name}, te damos la bienvenida!
        </Typography>
        <>
        {infoError ? (
          <ClosedErrorAlert message="Error al obtener los datos." contoured={false}/>
        ) : (
          <>
          <Typography color="text.secondary">
            <Typography component="span" color="text.primary" fontWeight="bold" marginRight={1}>
              Número de equipo:
            </Typography>
            {user.group_number || "Sin asignar aún"}
          </Typography>
          <Typography color="text.primary">
            <Typography component="span" color="text.primary" fontWeight="bold" marginRight={1}>
              Compañeros:
            </Typography>
            {user.teammates || "Sin asignar aún"}
          </Typography>
          <Typography color="text.primary">
            <Typography component="span" color="text.primary" fontWeight="bold" marginRight={1}>
              Tema:
            </Typography>
            {user.topic || "Sin asignar aún"}
          </Typography>
          <Typography color="text.primary">
            <Typography component="span" color="text.primary" fontWeight="bold" marginRight={1}>
              Tutor:
            </Typography>
            {user.tutor || "Sin asignar aún"}
          </Typography>
          <Typography color="text.primary">
            <Typography component="span" color="text.primary" fontWeight="bold" marginRight={1}>
              Cursada:
            </Typography>
            {period || "Sin asignar aún"}
          </Typography>
          </>
        )}
        </>
      </CardContent>
    </StyledCard>
  );
};

export default StudentInfo;