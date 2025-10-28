import { Tooltip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const DeleteButton = ({
    onClick,
}) => {
    return (
        <GenericButton
            onClick={onClick}
            title="Eliminar"
            //iconColor={} // gris medio
            hoverIconColor="#d32f2f" // rojo
            hoverTransparentBg="rgba(211, 47, 47, 0.08)" // rojo leve transparente
        />
    )
}

const GenericButton = ({
    onClick,
    title,
    iconColor="#757575", // gris medio
    hoverIconColor,
    hoverTransparentBg,
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
                        color: {hoverIconColor}, // color al pasar el mouse
                        backgroundColor: {hoverTransparentBg}, // fondo leve color transparente
                    },
                }}
            >
                <DeleteIcon />
            </IconButton>
        </Tooltip>
    )
}