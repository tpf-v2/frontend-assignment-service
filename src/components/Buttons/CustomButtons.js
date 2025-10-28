import { Tooltip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const EditButton = ({
    onClick,
    sx,
}) => {
    return (
        <GenericButton
            onClick={onClick}
            title="Editar"
            hoverIconColor="#e0711d" // naranja
            hoverTransparentBg="rgba(224, 113, 29, 0.08)" // naranja leve transparente
            actionIcon={<EditIcon />}
            sx={sx} // pasamos los posibles estilos recibidos
        />
    )
}

export const DeleteButton = ({
    onClick,
    sx,
}) => {
    return (
        <GenericButton
            onClick={onClick}
            title="Eliminar"
            hoverIconColor="#d32f2f" // rojo
            hoverTransparentBg="rgba(211, 47, 47, 0.08)" // rojo leve transparente
            actionIcon={<DeleteIcon />}
            sx={sx} // pasamos los posibles estilos recibidos
        />
    )
}

const GenericButton = ({
    onClick,
    title,
    iconColor="#757575", // gris medio
    hoverIconColor,
    hoverTransparentBg,
    offset = [0,0], // más alto es cartel hover más lejos del ícono
    actionIcon, // el componente del ícono a mostrar
    sx={}, // estilos adicionales que se quieran pasar, se propagan al IconButton
}) => {
    return (
        <Tooltip // Cartel negro estándar al hacer hover
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
                            offset: offset, // reduce la distancia entre ícono y tooltip (vert: por defecto ~8)
                        },
                    },
                ],
            }}
        >
            <IconButton
                onClick={onClick}
                sx={{
                    color: iconColor, // gris
                    "&:hover": {
                        color: hoverIconColor, // color al pasar el mouse
                        backgroundColor: hoverTransparentBg, // fondo leve color transparente
                    },
                    ...sx, // propagamos los estilos recibidos al IconButton
                }}
            >
                {actionIcon}
            </IconButton>
        </Tooltip>
    )
}