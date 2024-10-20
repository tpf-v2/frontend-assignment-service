import React, { useState, useEffect } from "react";
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
  DialogTitle,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { uploadProjects } from "../api/uploadProjects"; 

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

const UploadFile = ({ projectType }) => {
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
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const groupId = useSelector((state) => state.user.group_id);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/learning-path");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.name.endsWith(".pdf")) {
      setSelectedFile(file);
      setFileError("");
    } else {
      setFileError("Por favor cargue un archivo PDF.");
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
    if (!projectTitle.trim() && projectType !== "intermediate-project") {
      setTitleError("Por favor ingrese el título del proyecto.");
      return;
    }
    setTitleError("");

    if (projectType === "intermediate-project" && !url.trim()) {
      setUrlError("Por favor ingrese un enlace válido.");
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
    "intermediate-project": "entrega Intermedia",
    "final-project": "entrega Final",
  };

  return (
    <Container maxWidth="sm">
      <Root>
        <Box textAlign="center">
          <Title variant="h5">Subir {projectNameKeyMap[projectType]}</Title>
        </Box>

        <form onSubmit={handleSubmit}>
          {projectType === "intermediate-project" ? (
            <TextField
              label="Ingrese el enlace del proyecto"
              variant="outlined"
              fullWidth
              margin="normal"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              error={Boolean(urlError)}
              helperText={urlError}
            />
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

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{isSuccess ? "Éxito" : "Error"}</DialogTitle>
          <DialogContent>
            <Typography variant="body1">{responseMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </Root>
    </Container>
  );
};

export default UploadFile;
