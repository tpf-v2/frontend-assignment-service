import { Root } from "./Root";
import {
    Container,
    Alert,
  } from "@mui/material";

export const ClosedErrorAlert = ({ message }) => {
    return (
      <Container maxWidth="sm">
        <Root>
          <Alert severity="error">
            {message}
          </Alert>
        </Root>
      </Container>
    );
  };