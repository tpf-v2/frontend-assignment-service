// La idea es reutilizar componentes iguales copypasteados en muchos archisos,
// e irlos reemplazando de a poco para poder probar su funcionamiento y asegurar que no rompimos nada.

import { styled } from "@mui/system";
import { Paper, Button, Container } from "@mui/material";
import { TitleSimple } from "../styles/Titles";

// Usados en varios forms de lado estudiante, ej Proponer Idea

export const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
}));

export const RootMargin = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
  marginBottom: theme.spacing(5),
}));

export const RootWhite = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#ffffff",
  boxShadow: theme.shadows[3],
}));

export const RootCeleste = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  backgroundColor: '#E3F2FD', // Celeste FIUBA
}));

export const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: "block", // con esta prop + marginLeft se ajusta el botón a la derecha
  marginLeft: "auto",
}));

export const Title = TitleSimple;

export const ButtonSimple = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));