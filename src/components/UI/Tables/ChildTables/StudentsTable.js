import React from 'react';
import { TableCell } from '@mui/material';
import ParentTable from '../ParentTable';
import { useSelector } from "react-redux";
import { TableType } from '../TableType';

const StudentsTable = ({dataListToRender = null}) => {
  // Este dataListToRender es opcional, para la pantalla de Estudiantes no se usa, pero
  // se agrega para poder pasarle una lista y no tener que llamar al endpoint
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

  if (dataListToRender === undefined) return;

  // Si le estoy pasando una dataListToRender, es que la estoy llamando para la Verificación previa
  // a algoritmos, y no quiero que haga ningún fetch
  if (dataListToRender !== null) {
    return (
      <ParentTable
        columns={columns} rowKeys={rowKeys} renderRow={renderRow}
        title={TableType.EMBEDDEDNOTITLE}
        items={dataListToRender}        
        enableEdit={false}
        enableDelete={false} // Consistencia con Verificación previa de equipos (no existe delete teams)
        enableAdd={false}
      />
    );
  } else {
    // Si no le pasé nada, es el uso por defecto que ya existía, es para mostrar tabla de Estudiantes
    return (
      <ParentTable title={title} columns={columns} rowKeys={rowKeys} endpoint={endpoint} renderRow={renderRow} items={students}/>
    );
  }
  
};

export default StudentsTable;