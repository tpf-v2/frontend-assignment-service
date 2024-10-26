import React from 'react';
import ParentTable from '../ParentTable';
import { TableCell, Box } from '@mui/material';
import AddButton from '../../../Buttons/AddButton';

const TopicsTable = () => {
  const endpoint = '/topics/'; // Replace with your endpoint
  const title = 'Temas';
  const columns = ['ID', 'Tema', 'Categoría'];

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
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 2, padding: 3 }}>
          <AddButton />
        </Box>
      </Box>  
  );
};

export default TopicsTable;