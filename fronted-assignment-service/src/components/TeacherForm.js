import React from 'react';
import Form from './Form';

const TeacherForm = () => {
    const fields = [
        { label: 'Nombre', type: 'text' },
        { label: 'Apellido', type: 'text' },
        { label: 'Mail', type: 'email' }
    ];

    return <Form role="Profesor" fields={fields} />;
};

export default TeacherForm;