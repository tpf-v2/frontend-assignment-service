import React from 'react';
import ParentTable from '../ParentTable';
import { TableCell } from '@mui/material';

const TopicsTable = () => {
  const endpoint = '/topics/'; // Replace with your endpoint
  const title = 'Temas';
  const columns = ['ID', 'Tema', 'Categoría'];
  const rowKeys = {
    'ID': 'id',
    'Tema': 'name',
    'Categoría': 'category.name',
  };

  const renderRow = (item) => (
    <>
      <TableCell>{item.id}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.category.name}</TableCell> {/* Access nested object */}
    </>
  );

  return (
    <ParentTable title={title} columns={columns} rowKeys={rowKeys} endpoint={endpoint} renderRow={renderRow} />
  );
};

export default TopicsTable;