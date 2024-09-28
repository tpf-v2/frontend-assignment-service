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
