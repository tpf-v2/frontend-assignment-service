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
  const [user, setUser] = useState(null);

  const logInUser = (userData) => {
    setUser(userData);
  };

  const resetUser = () => {
    setUser(null);
  };

  const getColorBasedOnRole = (role) => {
    switch (role) {
      case 'tutor':
        return '#6A0DAD'; // Violeta medio oscurito
      case 'admin':
        return '#4CAF50'; // Verde
      case 'student':
      default:
        return '#0072C6'; // Celeste predeterminado
    }
  };

  const color = user ? getColorBasedOnRole(user.role) : '#0072C6'; // Color predeterminado para los no logueados

  return (
    <Router>
      <Box className="main-container">
        {/* Mostrar Header solo si el usuario está logueado */}
        {user && <Header user={user} color={color} handleHomeClick={resetUser} />}
        <Box className="content-container">
          <Routes>
            <Route path="/" element={<Home logInUser={logInUser} />} />
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
        {user && <Footer color={color} />}
      </Box>
    </Router>
  );
};

export default App;