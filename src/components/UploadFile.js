import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
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
import { uploadProjects } from "../api/uploadProjects";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

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

const DropzoneBox = styled(Box)(({ theme }) => ({
  border: "2px dashed #cccccc",
  padding: theme.spacing(3),
  textAlign: "center",
  cursor: "pointer",
  color: "rgba(0, 0, 0, 0.6)",
  marginBottom: theme.spacing(2),
  height: "150px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const UploadFile = ({ projectType, headerInfo }) => {
  const [selectedFile, setSelectedFile] = useState(null); // Estado para archivos
  const [fileError, setFileError] = useState("");
  const [url, setUrl] = useState(""); // Estado para la URL (solo para entrega intermedia)
  const [urlError, setUrlError] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const groupId = useSelector((state) => state.user.group_id);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.name.endsWith(".pdf") && file.size <= 100 * 1024 * 1024) {
      setSelectedFile(file);
      setFileError("");
      setExternalLink(null);
    } else {
      setFileError("Por favor cargue un archivo PDF que no supere los 100MB. O envialo a través del siguiente link: ");
      setExternalLink("https://forms.gle/8Hg5StAkDDD3xfxp9");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "application/pdf",
    disabled: projectType === "intermediate-project", // Desactiva Dropzone si es entrega intermedia
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación del título del proyecto
    if (projectTitle.length > 95) {
      setTitleError("El título no puede exceder los 95 caracteres.");
      return;
    }
    
    if (!projectTitle.trim() && projectType !== "intermediate-project") {
      setTitleError("Por favor ingrese el título del proyecto.");
      return;
    }
    setTitleError("");

    if (!selectedFile && projectType !== "intermediate-project") {
      setFileError("Por favor cargue un archivo PDF.");
      return;
    } 
    setFileError("");
    
    const youtubeOrDrivePattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|drive\.google\.com)\/.+$/;

    if (
      projectType === "intermediate-project" &&
      (!url.trim() || !youtubeOrDrivePattern.test(url))
    ) {
      setUrlError(
        "Por favor ingrese un enlace de YouTube o Google Drive válido."
      );
      return;
    }

    setLoading(true);

    const { success, message } = await uploadProjects({
      projectType,
      groupId,
      projectTitle,
      selectedFile,
      url,
      token: user.token,
    });

    setResponseMessage(message);
    setIsSuccess(success);
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
          {projectType === "intermediate-project" ? (
            <>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ marginBottom: "8px" }}
                align="center"
              >
                El link de la entrega intermedia debe ser un enlace a YouTube o
                Google Drive
              </Typography>

              <TextField
                label="Ingrese el enlace al video"
                variant="outlined"
                fullWidth
                margin="normal"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                error={Boolean(urlError)}
                helperText={urlError}
              />
            </>
          ) : (
            <>
              <TextField
                label="Ingrese el título del proyecto"
                variant="outlined"
                fullWidth
                margin="normal"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                error={Boolean(titleError)}
                helperText={titleError}
              />

              <DropzoneBox {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Suelta el archivo aquí...</p>
                ) : (
                  <p>
                    Arrastra y suelta el archivo aquí, o haz clic para
                    seleccionar el archivo PDF
                  </p>
                )}
              </DropzoneBox>
            </>
          )}

          {selectedFile && (
            <Typography variant="body1">
              Archivo seleccionado: {selectedFile.name}
            </Typography>
          )}
          {fileError && (
            <Typography variant="body2" color="error">
              {fileError}
              {externalLink && (
                <a href={externalLink} target="_blank" rel="noopener noreferrer">
                  {externalLink}
                </a>
              )}
            </Typography>
          )}

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

export default UploadFile;
