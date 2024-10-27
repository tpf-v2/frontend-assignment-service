import React, { useState } from 'react';
import { Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddButton = ({ DialogComponent, dialogProps }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 2, padding: 3 }}>
      <Fab size="small" color="primary" aria-label="add" onClick={handleClickOpen}>
        <AddIcon />
      </Fab>
      {DialogComponent && React.cloneElement(DialogComponent, { ...dialogProps, open, handleClose })}
    </Box>
  );
};

export default AddButton;
