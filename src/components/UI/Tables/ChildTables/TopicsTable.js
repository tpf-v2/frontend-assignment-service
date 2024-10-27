import React from 'react';
import ParentTable from '../ParentTable';
import { TableCell, Box } from '@mui/material';
import { useSelector } from 'react-redux';

import AddButton from '../../../Buttons/AddButton';
import { setTopics } from '../../../../redux/slices/topicsSlice';
import { addTopic } from '../../../../api/handleTopics';

const TopicsTable = () => {
  const endpoint = '/topics/'; 
  const title = 'Tema';
  const columns = ['ID', 'Tema', 'Categoría'];
  
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

  return (
      <Box>
        <ParentTable title={title} columns={columns} endpoint={endpoint} renderRow={renderRow} />
      <AddButton itemFields={itemFields} addItemAction={addTopic} title={title} items={topics} setItems={setTopics} />
      </Box>  
  );
};

export default TopicsTable;