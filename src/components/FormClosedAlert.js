import { styled } from "@mui/system";
import {
    Container,
    Paper,
    Alert,
  } from "@mui/material";

const Root = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(10),
    padding: theme.spacing(4),
    boxShadow: theme.shadows[10],
  }));
const FormClosedAlert = () => {
  return (
    <Container maxWidth="sm">
          <Root>

      <Alert severity="info">
        No se aceptan mas respuestas al formulario de grupos.
      </Alert>
      </Root>

    </Container>
  );
};

export default FormClosedAlert;
