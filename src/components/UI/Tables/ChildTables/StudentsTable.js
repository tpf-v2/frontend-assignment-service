import React from 'react';
import { TableCell } from '@mui/material';
import ParentTable from '../ParentTable';
import { useSelector } from "react-redux";
import { TableType } from '../TableType';

const StudentsTable = () => {
  const period = useSelector((state) => state.period);
  const endpoint = `/students/?period=${period.id}`; // Replace with your endpoint
  const title = TableType.STUDENTS;
  const columns = ['Padron', 'Nombre', 'Apellido', 'Email']; // Specify your column names here
  const rowKeys = {
    'Padron': 'id',
    'Nombre': 'name',
    'Apellido': 'last_name',
    'Email': 'email',
  };

  const students = Object.values(useSelector((state) => state.students))
  .map(({ version, rehydrated, ...rest }) => rest)
  .filter(item => Object.keys(item).length > 0);
  
  const renderRow = (item) => (
    <>
      <TableCell>{item.id}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.last_name}</TableCell>
      <TableCell>{item.email}</TableCell>
    </>
  );
  
  return (
    <ParentTable title={title} columns={columns} rowKeys={rowKeys} endpoint={endpoint} renderRow={renderRow} items={students}/>
  );
};

export default StudentsTable;