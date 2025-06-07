import { Alert } from "@mui/material";
import { Container } from "@mui/system";

const BrowserWarning = ({ message }) => {
  message = message || "Esta funcionalidad no está disponible en tu navegador. Por favor, utiliza Google Chrome version 137 o superior."
  return (
    <Container maxWidth="sm">
        <Alert severity="error">
          {message}
        </Alert>
    </Container>
  );
};

export default BrowserWarning;
