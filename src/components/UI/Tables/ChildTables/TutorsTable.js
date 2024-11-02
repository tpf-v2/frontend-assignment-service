import React from 'react';
import ParentTable from '../ParentTable';
import { TableCell } from '@mui/material';
import { useParams } from 'react-router';

const TutorsTable = () => {
  const { period } = useParams();
  const endpoint = `/tutors/periods/${period}`;
  const title = 'Tutores';
  
  const columns = ['ID', 'Nombre', 'Apellido', 'Email'];
  const rowKeys = {
    'ID': 'id',
    'Nombre': 'name',
    'Apellido': 'last_name',
    'Email': 'email'
  };

  const renderRow = (item) => (
    <>
      <TableCell>{item.id}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.last_name}</TableCell>
      <TableCell>{item.email}</TableCell>
    </>
  );

  return (
    <ParentTable title={title} columns={columns} rowKeys={rowKeys} endpoint={endpoint} renderRow={renderRow} />
  );
};

export default TutorsTable;