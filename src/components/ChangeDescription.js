import { useState } from "react";
import {
  Container,
  Button,
  Typography,
  Box,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { uploadDescription } from "../api/postDescription";

const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
}));

const ChangeDescription = ({ projectType, headerInfo, user }) => {
  const [description, setDescription] = useState(""); // Estado para la URL (solo para entrega intermedia)
  const [descriptionError, setDescriptionError] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación del título del proyecto
    if (description.length > 10000) {
      setDescriptionError("La descripción no puede exceder los 10000 caracteres.");
      return;
    }
    
    if (!description.trim()) {
      setDescriptionError("Por favor ingrese una descripción.");
      return;
    }
    setDescriptionError("");
    setLoading(true);
    console.log("user:")
    console.log(user)
    const upload = await uploadDescription(user, description)

    setResponseMessage("Descripción publicada."); // TODO: revisar response code
    setIsSuccess(true);
    setLoading(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    if (isSuccess) {
      navigate("/learning-path");
    }
  };

  const projectNameKeyMap = {
    "initial-project": "Anteproyecto",
    "intermediate-project": "Entrega Intermedia",
    "final-project": "Entrega Final",
  };

  return (
    <Container maxWidth="sm">
      <Root>
        <Box textAlign="center">
          <Title variant="h5">Subir {projectNameKeyMap[projectType]}</Title>
        </Box>

        {!!headerInfo ? (
            <Alert severity="info">
              {headerInfo}
            </Alert>
          ) : (
            null
          )
        }

        <form onSubmit={handleSubmit}>
        {
            <>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ marginBottom: "8px" }}
                align="center"
              >
                Provea una descripción de su proyecto final. Esta descripción será utilizada al publicar su proyecto en esta aplicación.
              </Typography>

              <TextField
                label="Descripción..."
                variant="outlined"
                fullWidth
                margin="normal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={Boolean(descriptionError)}
                helperText={descriptionError}
              />
            </>
        }
          <ButtonStyled
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? "Cargando..." : "Aceptar"}
          </ButtonStyled>
        </form>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="xs"
          fullWidth
        >
          {/* Icono centrado y mensaje */}
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "24px 16px",
            }}
          >
            {isSuccess ? (
              <CheckCircleIcon sx={{ fontSize: 60, color: "#4CAF50" }} />
            ) : (
              <ErrorIcon sx={{ fontSize: 60, color: "#F44336" }} />
            )}
            <Typography
              variant="h6"
              sx={{
                color: isSuccess ? "#4CAF50" : "#F44336",
                fontWeight: "600",
                marginTop: "16px",
              }}
            >
              {isSuccess ? "¡Operación Exitosa!" : "Ha Ocurrido un Error"}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ marginTop: "8px", padding: "0 12px" }}
            >
              {responseMessage}
            </Typography>
          </DialogContent>

          {/* Botón de acción centrado */}
          <DialogActions
            sx={{ justifyContent: "center", paddingBottom: "16px" }}
          >
            <Button
              onClick={handleCloseDialog}
              variant="contained"
              sx={{
                backgroundColor: isSuccess ? "#4CAF50" : "#F44336",
                color: "white",
                padding: "8px 24px",
                fontWeight: "bold",
                borderRadius: "24px",
                "&:hover": {
                  backgroundColor: isSuccess ? "#388E3C" : "#D32F2F",
                },
              }}
            >
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </Root>
    </Container>
  );
};

export default ChangeDescription;
