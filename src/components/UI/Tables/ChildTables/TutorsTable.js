import React from 'react';
import ParentTable from '../ParentTable';
import { TableCell } from '@mui/material';
import { useParams } from 'react-router';
import { useSelector } from "react-redux";

import AddItemDialog from '../../../AddItemDialog'
import AddButton from '../../../Buttons/AddButton';
import { setTutors } from '../../../../redux/slices/tutorsSlice'
import { addTutor } from '../../../../api/handleTutors';

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

  const tutors = Object.values(useSelector((state) => state.tutors))
  .map(({ version, rehydrated, ...rest }) => rest)
  .filter(item => Object.keys(item).length > 0);

  const itemFields = [
    { name: 'id', label: 'DNI', type: 'number' },
    { name: 'name', label: 'Nombre', type: 'text' },
    { name: 'last_name', label: 'Apellido', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'capacity', label: 'Capacidad', type: 'number' },
  ]

  const renderRow = (item) => (
    <>
      <TableCell>{item.id}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.last_name}</TableCell>
      <TableCell>{item.email}</TableCell>
    </>
  );

  const AddButtonComponent = () => (
    <AddButton
      DialogComponent={
        <AddItemDialog
          itemFields={itemFields}
          addItemAction={addTutor}
          title="Tutor"
          items={tutors}
          setItems={setTutors}
        />
      }
      dialogProps={{ items: tutors, setItems: setTutors }}
    />
  );

  return (
    <ParentTable title={title} columns={columns} rowKeys={rowKeys} endpoint={endpoint} renderRow={renderRow} AddButtonComponent={AddButtonComponent}
    items={tutors}/>
  );
};

export default TutorsTable;