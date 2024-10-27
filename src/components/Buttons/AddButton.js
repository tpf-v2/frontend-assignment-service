import React, { useState } from 'react';
import { Fab, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddItemDialog from '../AddItemDialog';

const AddButton = ({ itemFields, addItemAction, title, items, setItems}) => {
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
            <AddItemDialog
                open={open}
                handleClose={handleClose}
                itemFields={itemFields}
                addItemAction={addItemAction}
                title={title}
                items={items}
                setItems={setItems}
            />
        </Box>
    );
};
export default AddButton;