import { Button } from "@mui/material";
import { styled } from "@mui/system";

const ButtonStyled = styled(Button)(({ theme, width }) => ({
    marginTop: theme.spacing(2),
    width: width,
    padding: theme.spacing(1),
    fontSize: "1rem",
    "&.MuiButton-containedPrimary": { backgroundColor: "#6b6b6bff" },
    "&.MuiButton-containedSecondary": { backgroundColor: "#313131ff" },
    "&:hover.MuiButton-containedPrimary": { backgroundColor: "#5e5e5eff" },
    "&:hover.MuiButton-containedSecondary": { backgroundColor: "#303030" },
}));
  
const DeEmphasizedSubmitButton = ({ title, handleSubmit, width, disabled }) => {

    return (
        <ButtonStyled variant="contained" color="primary" width={width} onClick={handleSubmit} disabled={disabled}>
            {title}
        </ButtonStyled>
    );
};

export default DeEmphasizedSubmitButton;