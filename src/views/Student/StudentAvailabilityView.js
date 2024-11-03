
import React from "react";
import { Container, Paper } from "@mui/material";
import AvailabilityCalendar from "../../components/AvailabilityCalendar";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import ClosedAlert from "../../components/ClosedAlert";

// Estilos
const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#ffffff",
  boxShadow: theme.shadows[3],
}));

const StudentAvailabilityView = () => {
  const period = useSelector((state) => state.period);

  return (
    
    <Container maxWidth={false} sx={{ maxWidth: "1350px" }}>
    {period.presentation_dates_available ? (
      <Root>
        <AvailabilityCalendar />
      </Root>
    ) : (
      <ClosedAlert message="No se aceptan respuestas al formulario de fechas." />
    )}
    </Container>
  );
};

export default StudentAvailabilityView;
