import React, { useState } from 'react';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import MySnackbar from '../components/UI/MySnackBar';
import { getCategories } from '../utils/getCategories';

const AddItemDialog = ({ open, handleClose, itemFields, addItemAction, title, items, setItems }) => {
    const [newItem, setNewItem] = useState({});
    const dispatch = useDispatch();
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        status: "",
    });

    const user = useSelector((state) => state.user);
    
    const handleAddItem = async () => {
        try {
            const item = await addItemAction(newItem, user);
            setNewItem(itemFields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
            setNotification({
                open: true,
                message: `${title} agregado éxitosamente`,
                status: "success",
            });
            dispatch(setItems([...items, item]));
            handleClose(true);
        } catch (err) {
            console.error(`Error when adding new ${title}:`, err);
            setNotification({
                open: true,
                message: `Error al agregar ${title.toLowerCase()}. Por favor, vuelva a intentar más tarde.`,
                status: "error",
            });
        }
    };

    const handleSnackbarClose = () => {
        setNotification({ ...notification, open: false });
    };

    const categories = title === "Tema" ? getCategories(items) : items
    const renderField = (field) => {
        if (field.type === 'select') {
        return (
            <FormControl fullWidth margin="normal" key={field.name}>
            <InputLabel>{field.label}</InputLabel>
            <Select
                value={newItem[field.name] || ''}
                onChange={(e) => setNewItem({ ...newItem, [field.name]: e.target.value })}
                label={field.label}
            >
                {categories.map((item) => (
                <MenuItem key={item} value={item}>
                    {item}
                </MenuItem>
                ))}
            </Select>
            </FormControl>
        );
        } else {
        return (
            <FormControl fullWidth margin="normal" key={field.name}>
            <TextField
                variant="outlined"
                fullWidth
                placeholder={field.label}
                value={newItem[field.name] || ''}
                onChange={(e) => setNewItem({ ...newItem, [field.name]: e.target.value })}
            />
            </FormControl>
        );
        }
    };

    return (
        <>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Agregar Nuevo {title}</DialogTitle>
            <DialogContent>
                {itemFields.map(renderField)}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={handleAddItem} color="primary">
                    Agregar
                </Button>
            </DialogActions>
        </Dialog>
        <MySnackbar
            open={notification.open}
            handleClose={handleSnackbarClose}
            message={notification.message}
            status={notification.status}
        />
        </>
    );
};

export default AddItemDialog;
