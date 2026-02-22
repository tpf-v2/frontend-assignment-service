import { Container } from "@mui/material";
import AvailabilityCalendar from "../../components/AvailabilityCalendar";
import { useSelector } from "react-redux";
import ClosedAlert from "../../components/ClosedAlert";
import { RootWhite } from "../../components/Root";
import { StudentOrTutor } from "../../components/roleTypes";
// Estilos
const Root = RootWhite;

const StudentAvailabilityView = () => {
  const period = useSelector((state) => state.period);

  return (
    
    <Container maxWidth={false} sx={{ maxWidth: "1350px" }}>
    {period.presentation_dates_available ? (
      <Root>
        <AvailabilityCalendar role={StudentOrTutor.STUDENT} />
      </Root>
    ) : (
      <ClosedAlert message="No se aceptan respuestas al formulario de fechas." />
    )}
    </Container>
  );
};

export default StudentAvailabilityView;
