import React from "react";
import { Container, Paper } from "@mui/material";
import AvailabilityCalendar from "../../components/WIP/AvailabilityCalendar";
import { styled } from "@mui/material/styles";

// Estilos
const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#ffffff",
  boxShadow: theme.shadows[3],
}));

const StudentAvailabilityView = () => {
  return (
    <Container maxWidth={false} sx={{ maxWidth: "1350px" }}>
      <Root>
        <AvailabilityCalendar />
      </Root>
    </Container>
  );
};

export default StudentAvailabilityView;