import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const AddButton = ({ onFlagChange, isFlagActive, infoActive, infoNotActive }) => {

    return (
        <Tooltip 
            title={isFlagActive ? infoActive : infoNotActive}
            arrow
        >
            <Fab size="small" color="primary" aria-label="add" onClick={onFlagChange}>
                {isFlagActive ? <DeleteIcon /> : <AddIcon />}
            </Fab>
        </Tooltip>
    );
};

export default AddButton;
