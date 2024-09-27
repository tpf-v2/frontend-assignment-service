import { Button } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

const ButtonStyled = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    width: "100%",
    padding: theme.spacing(1),
    fontSize: "1rem",
    "&.MuiButton-containedPrimary": { backgroundColor: "#0072C6" },
    "&.MuiButton-containedSecondary": { backgroundColor: "#A6A6A6" },
    "&:hover.MuiButton-containedPrimary": { backgroundColor: "#005B9A" },
    "&:hover.MuiButton-containedSecondary": { backgroundColor: "#7A7A7A" },
}));
  
const SubmitButton = ({ url, title }) => {
    const navigate = useNavigate();

    const handleNavigation = (url) => {
        navigate(url);
    };

    return (
        <ButtonStyled variant="contained" color="primary" onClick={() => handleNavigation(url)}>
            {title}
        </ButtonStyled>
    );
};

export default SubmitButton;