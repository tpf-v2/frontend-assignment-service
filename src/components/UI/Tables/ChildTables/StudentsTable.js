import React from 'react';
import { TableCell } from '@mui/material';
import ParentTable from '../ParentTable';
import { useSelector } from 'react-redux';

const StudentsTable = () => {
  const period = useSelector((state) => state.period);
  const endpoint = `/students/?period=${period.id}`; // Replace with your endpoint
  const title = 'Alumnos';
  const columns = ['Padron', 'Nombre', 'Apellido', 'Email']; // Specify your column names here

  const renderRow = (item) => (
    <>
      <TableCell>{item.id}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.last_name}</TableCell>
      <TableCell>{item.email}</TableCell>
    </>
  );

  return (
    <ParentTable title={title} columns={columns} endpoint={endpoint} renderRow={renderRow} />
  );
};

export default StudentsTable;