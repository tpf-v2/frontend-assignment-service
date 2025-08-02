import React from "react";
import TableCell from "@mui/material/TableCell";
import { useTheme } from "@mui/material/styles";

function ExpandableCell({ show, rowSpan, children, isHeader = false }) {
  const theme = useTheme();

  //if (!show) return null;

  return (
    <TableCell
      rowSpan={show ? rowSpan : 1}
      sx={{
        fontWeight: isHeader ? "bold" : "normal",
        backgroundColor: isHeader
          ? theme.palette.grey[100]
          : "transparent",

        transition: "all 0.5s ease",
        opacity: show ? 1 : 0,
        transform: show ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
        //whiteSpace: "nowrap",
        overflow: "hidden",
        //width: show ? 200 : 0,
        //padding: show ? "16px" : 0,


        whiteSpace: "normal",          // Permitir salto de línea
        //maxWidth: 3000,                 // Limitar ancho máximo para que no estire la tabla
        // este colapsa bien pero al abrir tienen 1 letra c/u //wordBreak: "break-word",       // Romper palabras largas para no desbordar


        // A VER 

        wordBreak: "break-word",    

        width: show ? "auto" : 0,
        minWidth: show ? 100 : 0,
        maxWidth: show ? 200 : 0,
        //padding: show ? (isHeader ? "16px" : undefined) : 0,
      }}
    >
      {children}
    </TableCell>
  );
}

export default ExpandableCell;