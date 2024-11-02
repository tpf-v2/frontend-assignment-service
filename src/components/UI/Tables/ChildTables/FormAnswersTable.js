import React from 'react';
import ParentTable from '../ParentTable';
import { TableCell } from '@mui/material';

const FormAnswersTable = () => {
  const endpoint = '/forms/answers'; // Replace with your endpoint
  const title = 'Respuestas';
  const columns = ['Fecha de envio', 'Alumnos', 'Temas']; // Specify your column names here
  const rowKeys = {
    'Fecha de envio': 'id',
    'Alumnos': 'students',
    'Temas': 'topics',
  };

  const renderRow = (item) => (
    <>
      <TableCell>{item.id}</TableCell>
      <TableCell>{item.students.join(', ')}</TableCell> {/* Join array for display */}
      <TableCell>{item.topics.join(', ')}</TableCell> {/* Join array for display */}
    </>
  );

  return (
    <ParentTable title={title} columns={columns} rowKeys={rowKeys} endpoint={endpoint} renderRow={renderRow} />
  );
};

export default FormAnswersTable;