import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import FormSelection from './components/FormSelection';
import StudentForm from './components/StudentForm';
import TutorForm from './components/TutorForm';
import AdminForm from './components/AdminForm';
import AddTopicForm from './components/AddTopicForm';
import AddTutorForm from './components/AddTutorForm';

const App = () => {
  const studentEmail = 'student@example.com'; // Este es solo un ejemplo. Puedes obtener esto de otro lugar en tu estado de aplicación.

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form-selection" element={<FormSelection />} />
        <Route path="/student-form" element={<StudentForm />} />
        <Route path="/tutor-form" element={<TutorForm />} />
        <Route path="/admin-form" element={<AdminForm />} />
        <Route path="/admin-add-topic" element={<AddTopicForm />} />
        <Route path="/admin-add-corrector" element={<AddTutorForm />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;