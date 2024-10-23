import React from 'react';
import ParentTable from '../ParentTable';
import { TableCell } from '@mui/material';
import { useParams } from 'react-router';

const TutorsTable = () => {
  const { period } = useParams(); // Captura del period
  const endpoint = `/tutors/periods/${period}`;
  const title = 'Tutores';
  const columns = ['ID', 'Nombre', 'Apellido', 'Email'];

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

export default TutorsTable;