import React from 'react';
import ParentTable from '../ParentTable';
import { TableCell } from '@mui/material';
import { useSelector } from 'react-redux';

import AddButton from '../../../Buttons/AddButton';
import AddItemDialog from '../../../AddItemDialog'
import { setTopics } from '../../../../redux/slices/topicsSlice';
import { addTopic } from '../../../../api/handleTopics';

const TopicsTable = () => {
  const endpoint = '/topics/'; 
  const title = 'Temas';
  const columns = ['ID', 'Tema', 'Categoría'];
  const rowKeys = {
    'ID': 'id',
    'Tema': 'name',
    'Categoría': 'category.name',
  };
  
  const topics = Object.values(useSelector((state) => state.topics))
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter(item => Object.keys(item).length > 0); // Elimina objetos vacíos  console.log(topics)
  
  
  const itemFields = [
      { name: 'name', label: 'Título', type: 'text' },
      { name: 'category', label: 'Categoría', type: 'select' },
  ]

  const renderRow = (item) => (
    <>
      <TableCell>{item.id}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.category.name}</TableCell> {/* Access nested object */}
    </>
  );

  const AddButtonComponent = () => (
    <AddButton
      DialogComponent={
        <AddItemDialog
          itemFields={itemFields}
          addItemAction={addTopic}
          title="Tema"
          items={topics}
          setItems={setTopics}
        />
      }
      dialogProps={{ items: topics, setItems: setTopics }}
    />
  );

  return (
    <ParentTable title={title} columns={columns} rowKeys={rowKeys} endpoint={endpoint} renderRow={renderRow} AddButtonComponent={AddButtonComponent}
    items={topics}/>
  );
};

export default TopicsTable;