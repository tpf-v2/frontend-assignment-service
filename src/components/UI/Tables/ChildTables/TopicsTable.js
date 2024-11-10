import React from 'react';
import ParentTable from '../ParentTable';
import { TableCell } from '@mui/material';
import { useSelector } from 'react-redux';

const TopicsTable = () => {
  const period = useSelector((state) => state.period);

  const endpoint = `/topics/?period=${period.id}`; 
  const title = 'Temas';
  const columns = ['ID', 'Tema', 'Categoría'];
  const rowKeys = {
    'ID': 'id',
    'Tema': 'name',
    'Categoría': 'category.name',
  };
  
  const topics = Object.values(useSelector((state) => state.topics))
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter(item => Object.keys(item).length > 0); // Elimina objetos vacíos

  const renderRow = (item) => (
    <>
      <TableCell>{item.id}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.category.name}</TableCell> {/* Access nested object */}
    </>
  );


  return (
    <ParentTable title={title} columns={columns} rowKeys={rowKeys} endpoint={endpoint} renderRow={renderRow} items={topics}/>
  );
};

export default TopicsTable;