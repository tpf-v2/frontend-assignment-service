import { Tooltip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const DeleteButton = ({
    onClick,
    title,
    iconColor,
    hoverColor,
    hoverBg,
    offset = [0,0],

}) => {
    return (
        <Tooltip
            title={title}
            placement="top" // fuerza que aparezca arriba
            arrow // "flechita" visual, en el cartel de hover (x def es solo un rectángulo)
            slotProps={{
                tooltip: {
                    sx: {
                        backgroundColor: "black",
                        color: "white",
                        fontSize: "0.875rem",
                    },
                },
                arrow: {
                    sx: {
                        color: "black", // color de la flecha
                    },
                },
            }}
            PopperProps={{
                modifiers: [
                    {
                        name: "offset",
                        options: {
                            offset: {offset}, // reduce la distancia entre ícono y tooltip (vert: por defecto ~8)
                        },
                    },
                ],
            }}
        >
            <IconButton
                onClick={onClick}
                sx={{
                    color: {iconColor}, // gris medio
                    "&:hover": {
                        color: {hoverColor}, // color al pasar el mouse
                        backgroundColor: {hoverBg}, // fondo leve color transparente
                    },
                }}
            >
                <DeleteIcon />
            </IconButton>
        </Tooltip>
    )
}