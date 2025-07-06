import { useEffect, useState } from "react";

// Cada vez que se llama a este custom hook, se llama de nuevo a useState, por lo que cada llamada a este custom hook
// tiene su propio estado (no compartido entre llamadas a este hook).
export const useOpenCloseStateModalLogic = ({openEditModal, item, setOpenAddModal, setOpenEditModal, setOriginalEditedItemId, setParentItem}) => {
      
      const [newItem, setNewItem] = useState({});
      const [editedItem, setEditedItem] = useState({}); // data
      
      // Esto hace de handle open edit (el handle open add no es necesario xq solo se setea un bool desde afuera)
      useEffect(() => {
        if (!openEditModal) return;

        setEditedItem(item); // éste es el set complicado xq se crea acá adentro
        setOriginalEditedItemId(item.id);        

      }, [openEditModal, item]);
      
      ///// Estos handles son comunes a todos los modals /////
      const handleClickOpenAddModal = () => {
          setOpenAddModal(true);
      };
      
      const handleClickOpenEditModal = (item) => {
          // El id puede cambiar, así que guardamos el id original
          setOriginalEditedItemId(item.id);
          setEditedItem(item);
          setOpenEditModal(true);    
      };

      const handleCloseAddModal = () => {
          setNewItem({})
          setOpenAddModal(false);
          setParentItem(false);
      };
      
      const handleCloseEditModal = () => {
          setEditedItem({})
          setOpenEditModal(false);
          setParentItem(false);
      };

      return {newItem, setNewItem, editedItem, setEditedItem, handleCloseAddModal, handleCloseEditModal};
};