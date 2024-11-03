import React from 'react';
import { TableCell } from '@mui/material';
import ParentTable from '../ParentTable';
import { useSelector } from "react-redux";

import AddItemDialog from '../../../AddItemDialog'
import AddButton from '../../../Buttons/AddButton';
import { addStudent } from '../../../../api/handleStudents';
import { setStudents } from '../../../../redux/slices/studentsSlice';

const StudentsTable = () => {
  const period = useSelector((state) => state.period);
  const endpoint = `/students/?period=${period.id}`; // Replace with your endpoint
  const title = 'Alumnos';
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

  const itemFields = [
    { name: 'id', label: 'Padron', type: 'text' },
    { name: 'name', label: 'Nombre', type: 'text' },
    { name: 'last_name', label: 'Apellido', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
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
          addItemAction={addStudent}
          title="Alumno"
          items={students}
          setItems={setStudents}
        />
      }
      dialogProps={{ items: students, setItems: setStudents }}
    />
  );
  
  return (
    <ParentTable title={title} columns={columns} rowKeys={rowKeys} endpoint={endpoint} renderRow={renderRow} AddButtonComponent={AddButtonComponent}
    items={students}/>
  );
};

export default StudentsTable;