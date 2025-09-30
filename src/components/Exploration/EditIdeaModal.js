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
    handleConfirm,
    editType, // Reutilizo el modal, sirve para contenido y para estado
    titleText, // estas dos son strings, la editType en cambio es una constante
    okButtonText,
}) => {
    
    //const editType = "ideaContent"; // ideaStatus    

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
            {titleText} Idea
          </DialogTitle>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // previene el reload del form
              // Técnicamente este handleConfirm, al crearse afuera,
              // ya tiene el data y el setData. (Técnicamente también tiene el bool).
              handleConfirm(handleCloseModal, editType);
            }}
          >
            <DialogContent dividers sx={{ padding: "24px 24px 16px" }}>
                {editType === "ideaContent" && (
                    <WriteIdeaFields data={data} setData={setData}/>
                )}
                {editType === "ideaStatus" && (
                  <>
                    {data?.full_team
                        ? <>¿Informar que el equipo busca integrantes nuevamente?</>
                        : <>¿Informar que se completó el equipo?</>
                    }
                  </>
                )}
              
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} variant="outlined" color="error">
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {okButtonText}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
    )
}