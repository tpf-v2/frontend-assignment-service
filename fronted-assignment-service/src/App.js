import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import FormSelection from './components/Forms/FormSelection';
import StudentForm from './components/Forms/StudentForm';
import TutorForm from './components/Forms/TutorForm';
import AdminForm from './components/Forms/AdminForm';
import AddTopicForm from './components/Forms/AddTopicForm';
import AddTutorForm from './components/Forms/AddTutorForm';
import Header from './components/Header';
import Footer from './components/Footer';
import Profile from './components/Profile';
import { Box } from '@mui/material';
import './App.css'; // Importar los estilos globales

const App = () => {
  // Ejemplo de usuario logueado (puedes obtener esta información desde el backend)
  const [user, setUser] = useState({
    name: 'Juan',
    lastName: 'Perez',
    email: 'juan.perez@example.com'
  });

  return (
    <Router>
      <Box className="main-container">
        {/* Mostrar Header solo si el usuario está logueado */}
        {user && <Header user={user} />}
        <Box className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/form-selection" element={<FormSelection />} />
            <Route path="/student-form" element={<StudentForm />} />
            <Route path="/tutor-form" element={<TutorForm />} />
            <Route path="/admin-form" element={<AdminForm />} />
            <Route path="/admin-add-topic" element={<AddTopicForm />} />
            <Route path="/admin-add-corrector" element={<AddTutorForm />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>
        {/* Mostrar Footer solo si el usuario está logueado */}
        {user && <Footer />}
      </Box>
    </Router>
  );
};

export default App;