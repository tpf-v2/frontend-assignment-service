import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
  } from "@mui/material";
import { WriteIdeaFields } from "../Forms/WriteIdeaFields";

// Enum en reactjs
export const EditType = Object.freeze({
    CONTENT: "ideaContent",
    STATUS: "ideaStatus",
});

export const EditIdeaModal = ({
    open,
    setOpen,
    data, // la necesito para mostrarla en el WriteIdea
    setData,
    handleConfirm,
    editType, // Reutilizo el modal, sirve para contenido y para estado
    titleText, // estas dos son strings a mostrar, la editType en cambio es una constante
    okButtonText,
}) => {
    
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
              handleConfirm(handleCloseModal, editType);
            }}
          >
            <DialogContent dividers sx={{ padding: "24px 24px 16px" }}>
                {editType === EditType.CONTENT && (
                    <WriteIdeaFields data={data} setData={setData}/>
                )}
                {editType === EditType.STATUS && (
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