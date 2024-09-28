import React, { useState } from "react";
import { Typography, Box, TextField, Button } from "@mui/material";
import { styled } from "@mui/system";

const GroupReviewContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#f9f9f9",
  width: "100%",
}));

const PdfPreviewBox = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  border: "1px solid #ccc",
  borderRadius: "4px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#ffffff",
  marginTop: theme.spacing(2),
}));

const GroupReview = ({ groupId}) => {
  const [comment, setComment] = useState("");

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = () => {
    console.log(`Comentario para Grupo ${groupId}: ${comment}`);
    setComment("");
  };

  return (
    <GroupReviewContainer>
        <Typography variant="h4" align="center" gutterBottom>
          Grupo {groupId}
        </Typography>
      <PdfPreviewBox>
        <iframe
          src=""
          width="100%"
          height="100%"
          style={{ border: "none" }}
          title={`PDF for Group ${groupId}`}
        />
      </PdfPreviewBox>

      <Box
        sx={{
          width: "100%",
          marginTop: 2,
        }}
      >
        <Typography variant="h6" mb={1}>
          Feedback
        </Typography>
        <TextField
          multiline
          rows={4}
          value={comment}
          onChange={handleCommentChange}
          variant="outlined"
          placeholder="Escribe tu comentario aquí..."
          sx={{ mb: 2, width: "100%" }}
        />
        <Button variant="contained" onClick={handleSubmit} color="primary">
          Enviar
        </Button>
      </Box>
    </GroupReviewContainer>
  );
};

export default GroupReview;
