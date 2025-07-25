import React from "react";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import CuatrimestreConfig from "../../../CuatrimestreConfig";

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

const ContentInicio = ({ navigate, period }) => {
  return (
    <>
      <Box display="flex" justifyContent="space-between" width="100%">
        <ButtonStyled onClick={() => navigate(`/dashboard/${period}/students`)}> ESTUDIANTES</ButtonStyled>
        <ButtonStyled onClick={() => navigate(`/dashboard/${period}/tutors`)}> TUTORES</ButtonStyled>
      </Box>
      <Box display="flex" justifyContent="space-between" width="100%">
        <ButtonStyled onClick={() => navigate(`/dashboard/${period}/topics`)}> TEMAS</ButtonStyled>
        <ButtonStyled onClick={() => navigate(`/dashboard/${period}/teams`)}> EQUIPOS</ButtonStyled>
      </Box>
      <CuatrimestreConfig />

    </>
  );
};

export default ContentInicio;
