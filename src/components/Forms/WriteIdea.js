import { TextField } from "@mui/material";
import { ButtonStyled } from "../../components/Root";


export const WriteIdea = ({formData, setFormData, handleSubmit}) => {

    // Esto es para manejar de forma genérica el guardado de e.target.value
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit}>
            
            <TextField
            label="Título"
            name="title" // para manejar de manera genérica el e.target.value con handleChange
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.title}
            onChange={handleChange}
            required
            />
            <TextField
            label="Descripción"
            name="description"
            fullWidth
            margin="normal"
            variant="outlined"
            value={formData.description}
            onChange={handleChange}
            multiline
            minrows={5}   // altura inicial
            maxRows={15}  // se expande hasta esta altura (luego scroll)
            required
            />            

            <ButtonStyled variant="contained" color="primary" type="submit" align="right">
            Enviar
            </ButtonStyled>
        </form>
    )

}