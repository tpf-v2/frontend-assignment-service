import React from 'react';
import ParentTable from '../ParentTable';
import { TableCell } from '@mui/material';
import { useSelector } from 'react-redux';

const FormAnswersTable = () => {
  const period = useSelector((state) => state.period);

  const endpoint = `/forms/answers?period=${period.id}`; // Replace with your endpoint
  const title = 'Respuestas';
  const columns = ['Fecha de envio', 'Estudiantes', 'Temas']; // Specify your column names here
  const rowKeys = {
    'Fecha de envio': 'id',
    'Estudiantes': 'students',
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
    <ParentTable title={title} columns={columns} rowKeys={rowKeys} endpoint={endpoint}
     renderRow={renderRow} enableEdit={false} />
  );
};

export default FormAnswersTable;