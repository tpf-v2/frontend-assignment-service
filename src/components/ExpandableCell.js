import React from "react";
import TableCell from "@mui/material/TableCell";
import { useTheme } from "@mui/material/styles";

function ExpandableCell({ show, rowSpan, children, isHeader = false }) {
  const theme = useTheme();

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
        overflow: "hidden",

        whiteSpace: "normal",          // Permitir salto de línea

        width: show ? "auto" : 0,
        minWidth: show ? 200 : 0,
        maxWidth: show ? 200 : 0,
      }}
    >
      {children}
    </TableCell>
  );
}

export default ExpandableCell;