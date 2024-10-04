import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const MySnackbar = ({ message, status, open, handleClose }) => {
  const getStatus = (status) => {
    switch (status) {
      case "error":
        return "error";
      case "success":
        return "success";
      default:
        return "info";
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={getStatus(status)}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MySnackbar;
