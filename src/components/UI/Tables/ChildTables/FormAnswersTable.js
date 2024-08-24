import React from 'react';
import ParentTable from '../ParentTable';
import { TableCell } from '@mui/material';

const FormAnswersTable = () => {
  const endpoint = '/forms/answers'; // Replace with your endpoint
  const title = 'Respuestas';
  const columns = ['Fecha de envio', 'Alumnos', 'Temas']; // Specify your column names here

  const renderRow = (item) => (
    <>
      <TableCell>{item.answer_id}</TableCell>
      <TableCell>{item.students.join(', ')}</TableCell> {/* Join array for display */}
      <TableCell>{item.topics.join(', ')}</TableCell> {/* Join array for display */}
    </>
  );

  return (
    <ParentTable title={title} columns={columns} endpoint={endpoint} renderRow={renderRow} />
  );
};

export default FormAnswersTable;