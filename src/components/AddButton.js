import React from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddButton = () => {
    const handleClick = () => {
        console.log("FAB clicked!");
    };

    return (
        <Fab size="small" color="primary" aria-label="add" onClick={handleClick}>
            <AddIcon />
        </Fab>
    );
};

export default AddButton;
