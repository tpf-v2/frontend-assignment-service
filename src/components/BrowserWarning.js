import { Alert } from "@mui/material";
import { Container } from "@mui/system";

const BrowserWarning = ({ message }) => {
  message = message || "Para hacer uso de esta funcionalidad, utilizar Google Chrome (version 137 o superior)."
  return (
    <Container maxWidth="sm">
        <Alert severity="error">
          {message}
        </Alert>
    </Container>
  );
};

export default BrowserWarning;
