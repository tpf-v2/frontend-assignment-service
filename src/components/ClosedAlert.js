import { styled } from "@mui/system";
import { Root } from "./Root";
import {
    Container,
    Paper,
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
