import React from 'react';
import Form from './Form';

const StudentForm = () => {
    const fields = [
        { label: 'Nombre', type: 'text' },
        { label: 'Apellido', type: 'text' },
        { label: 'Padrón', type: 'text' },
        { label: 'Mail', type: 'email' }
    ];

    return <Form role="Estudiante" fields={fields} />;
};

export default StudentForm;