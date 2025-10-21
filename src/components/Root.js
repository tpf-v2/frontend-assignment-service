// La idea es reutilizar componentes iguales copypasteados en muchos archisos,
// e irlos reemplazando de a poco para poder probar su funcionamiento y asegurar que no rompimos nada.

import { styled } from "@mui/system";
import { Paper, Button } from "@mui/material";
import { TitleSimple } from "../styles/Titles";

// Usados en varios forms de lado estudiante, ej Proponer Idea

export const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
}));

export const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: "block", // con esta prop + marginLeft se ajusta el botón a la derecha
  marginLeft: "auto",
}));

export const Title = TitleSimple;