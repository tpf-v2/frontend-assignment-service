import React from 'react';
import ParentTable from '../ParentTable';
import { TableCell } from '@mui/material';
import { useParams } from 'react-router-dom';

const GroupsTable = () => {
  const { cuatrimestre } = useParams(); // Captura del cuatrimestre
  const endpoint = `/groups/?period=${cuatrimestre}`;
  const title = 'Grupos armados';
  const columns = ['ID', 'Emails']; // Specify your column names here
  

  const renderRow = (item) => (
    <>
      <TableCell>{item.id}</TableCell>
      <TableCell>
        {item.students.map(student => student.email).join(', ')} {/* Mapea el array para mostrar los emails */}
      </TableCell>
    </>
  );

  return (
    <ParentTable title={title} columns={columns} endpoint={endpoint} renderRow={renderRow} />
  );
};

export default GroupsTable;