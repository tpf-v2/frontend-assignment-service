import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
  } from "@mui/material";
import { WriteIdeaFields } from "../Forms/WriteIdeaFields";

export const EditIdeaModal = ({
    open,
    setOpen,
    data, // la necesito para mostrarla en el WriteIdea
    setData,
    handleConfirm}) => {

    const ConfirmButtonText = "Guardar";
    const handleCloseModal = () => {
        setOpen(false);
        setData();
    };

    return (
        <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
          <DialogTitle
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: "#f5f5f5",
              color: "#333",
              padding: "16px 24px",
            }}
          >
            Editar Idea
          </DialogTitle>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // previene el reload del form
              // Técnicamente este handleConfirm, al crearse afuera,
              // ya tiene el data y el setData. (Técnicamente también tiene el bool).
              handleConfirm(handleCloseModal);
            }}
          >
            <DialogContent dividers sx={{ padding: "24px 24px 16px" }}>
                <WriteIdeaFields data={data} setData={setData}/>
              
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} variant="outlined" color="error">
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {ConfirmButtonText}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
    )
}