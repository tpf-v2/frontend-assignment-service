import { Root } from "./Root";
import {
    Container,
    Alert,
  } from "@mui/material";

export const ClosedErrorAlert = ({ message, contoured = true}) => {
    const alert = (
      // Este sx hace que si se le pasa un message con estas comillas `` entonces
      // muestre los enters literales
      <Alert severity="error" sx={{ whiteSpace: 'pre-line' }}>
        {message}
      </Alert>
    );

    // Si el bool está en true, se muestra el error con un recuadro blanco alrededor,
    // else sin recuadro
    return (
      contoured ? (
        <Container maxWidth="sm">
          <Root>
            {alert}          
          </Root>
        </Container>
      ) : ( alert)
    )
  };