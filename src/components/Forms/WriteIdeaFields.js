import { TextField } from "@mui/material";
import { ButtonStyled } from "../../components/Root";

// Contiene solamente el renderizado de los campos a editar, sin botones
export const WriteIdeaFields = ({data, setData}) => {

    // Esto es para manejar de forma genérica el guardado de e.target.value
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    
    if (!data) return;

    return (
        <>
            <TextField
            label="Título"
            name="title" // para manejar de manera genérica el e.target.value con handleChange
            fullWidth
            margin="normal"
            variant="outlined"
            value={data.title}
            onChange={handleChange}
            required
            />
            <TextField
            label="Descripción"
            name="description"
            fullWidth
            margin="normal"
            variant="outlined"
            value={data.description}
            onChange={handleChange}
            multiline
            minrows={5}   // altura inicial
            maxRows={15}  // se expande hasta esta altura (luego scroll)
            required
            />  
        </>        
    )
}