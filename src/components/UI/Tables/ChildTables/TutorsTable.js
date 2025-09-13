import React from 'react';
import ParentTable from '../ParentTable';
import { TableCell } from '@mui/material';
import { useParams } from 'react-router';
import { useSelector } from "react-redux";
import { TableType } from '../TableType';
import { addCapacityToTutors } from '../../../../utils/addCapacityToTutors';

const TutorsTable = () => {
  const { period } = useParams();
  const endpoint = `/tutors/periods/${period}`;
  const title = TableType.TUTORS;
  
  const columns = ['ID', 'Nombre', 'Apellido', 'Email', 'Capacidad'];
  const rowKeys = {
    'ID': 'id',
    'Nombre': 'name',
    'Apellido': 'last_name',
    'Email': 'email'
  };

  const csvColumns = ['NOMBRE', 'APELLIDO', 'MAIL', 'CAPACIDAD'];
  const csvRowKeys = {
    'NOMBRE': 'name',
    'APELLIDO': 'last_name',
    'MAIL': 'email',
    'CAPACIDAD': 'capacity'
  }

  const tutorsWithoutCapacityField = Object.values(useSelector((state) => state.tutors))
  .map(({ version, rehydrated, ...rest }) => rest)
  .filter(item => Object.keys(item).length > 0);
  const tutors = addCapacityToTutors(tutorsWithoutCapacityField, period);

  const renderRow = (item) => (
    <>
      <TableCell>{item.id}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.last_name}</TableCell>
      <TableCell>{item.email}</TableCell>
      <TableCell>{item.capacity}</TableCell>
    </>
  );

  return (
    <ParentTable title={title} columns={columns} rowKeys={rowKeys} endpoint={endpoint} renderRow={renderRow} items={tutors} csvColumns={csvColumns} csvRowKeys={csvRowKeys}/>
  );
};

export default TutorsTable;