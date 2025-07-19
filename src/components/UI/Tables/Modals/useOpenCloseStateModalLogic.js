import { useEffect, useState } from "react";

/* Comportamiento común a todos los modals de agregar y editar estudiante/tutor/tema. Dichos modals usan esto.
 * Aclaración: cada llamada a este custom hook tiene su propio estado (se llama nuevamente a useState cada vez,
 * es decir que no se comparte entre llamadas a este hook).*/
export const useOpenCloseStateModalLogic = ({openEditModal, item, setOpenAddModal, setOpenEditModal, setOriginalEditedItemId, setParentItem}) => {
      
      const [newItem, setNewItem] = useState({});
      const [editedItem, setEditedItem] = useState({}); // data
      
      // Esto hace de handle open edit (el handle open add no es necesario xq solo se setea un bool desde afuera)
      useEffect(() => {
        if (!openEditModal) return;

        setEditedItem(item);
        // El id puede cambiar, así que guardamos el id original
        setOriginalEditedItemId(item.id);        

      }, [openEditModal, item]);
      
      ///// Estos handles son comunes a todos los modals /////
      // Para abrir solamente se setea un bool desde afuera y el useEffect de acá arriba captura eso para el caso Editar
      // (caso Agregar no hay más cosas por hacer al abrir); para cerrar se usan estos handle close en los modal,
      // y también se pasan a la función que se ejecuta luego de confirmar el modal para que lo cierre ante error.

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