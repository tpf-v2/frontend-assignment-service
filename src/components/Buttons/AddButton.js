import React, { useState } from 'react';
import { Fab, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddNewTopic from '../AddComponentDialog';

const AddButton = () => {
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
            <AddNewTopic open={open} handleClose={handleClose} />
        </Box>
    );
};
export default AddButton;