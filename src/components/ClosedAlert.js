import { Root } from "./Root";
import {
    Container,
    Alert,
  } from "@mui/material";

const ClosedAlert = ({ message }) => {
  return (
    <Container maxWidth="sm">
      <Root>
        <Alert severity="info">
          {message}
        </Alert>
      </Root>
    </Container>
  );
};

export default ClosedAlert;
