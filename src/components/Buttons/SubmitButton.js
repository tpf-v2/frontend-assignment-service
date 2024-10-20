import { Button } from "@mui/material";
import { styled } from "@mui/system";

const ButtonStyled = styled(Button)(({ theme, width }) => ({
    marginTop: theme.spacing(2),
    width: width,
    padding: theme.spacing(1),
    fontSize: "1rem",
    "&.MuiButton-containedPrimary": { backgroundColor: "#0072C6" },
    "&.MuiButton-containedSecondary": { backgroundColor: "#A6A6A6" },
    "&:hover.MuiButton-containedPrimary": { backgroundColor: "#005B9A" },
    "&:hover.MuiButton-containedSecondary": { backgroundColor: "#7A7A7A" },
}));
  
const SubmitButton = ({ title, handleSubmit }) => {

    return (
        <ButtonStyled variant="contained" color="primary" onClick={handleSubmit}>
            {title}
        </ButtonStyled>
    );
};

export default SubmitButton;