import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import BackgroundContainer from "../components/UI/BackgroundContainer.js";
import EmailIcon from '@mui/icons-material/Email';
import { TitleSimple } from "../styles/Titles.js";

const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
}));

const Title = TitleSimple

const ConfirmEmailView = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <BackgroundContainer />
      <Root>
        <Box textAlign="center">
          <EmailIcon sx={{ fontSize: 60, color: 'primary.main', marginBottom: 2 }} />
          <Title variant="h4">Revisa tu Email</Title>
          <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 3 }}>
            Hemos enviado un link de recuperación a tu dirección de email.
            Haz clic en el link para restablecer tu contraseña.
          </Typography>
          
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 3 }}>
            Si no recibes el email en unos minutos, revisa tu carpeta de spam.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
            sx={{ marginTop: 2 }}
          >
            Volver al Login
          </Button>
        </Box>
      </Root>
    </Container>
  );
};

export default ConfirmEmailView;
