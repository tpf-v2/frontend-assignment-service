import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import FormSelection from './components/Forms/FormSelection';
import StudentForm from './components/Forms/StudentForm';
import TutorForm from './components/Forms/TutorForm';
import AdminForm from './components/Forms/AdminForm';
import AddTopicForm from './components/Forms/AddTopicForm';
import AddTutorForm from './components/Forms/AddTutorForm';
import UploadCSVForm from './components/Forms/UploadCSVForm';
import Header from './components/UI/Header';
import Footer from './components/UI/Footer';
import Profile from './components/Profile';
import { Box } from '@mui/material';
import BackgroundContainer from './components/UI/BackgroundContainer';
import './App.css'; // Importar los estilos globales
import { useDispatch, useSelector } from "react-redux";

const App = () => {
  // const [user, setUser] = useState(null);
  const user = useSelector((state) => state.user);

  const resetUser = () => {
    //setUser(null);
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
        {user.token && <Header user={user} color={color} handleHomeClick={resetUser} />}
        <BackgroundContainer/>
        <Box className="content-container">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/form-selection" element={<FormSelection />} />
            <Route path="/student-form" element={<StudentForm />} />
            <Route path="/tutor-form" element={<TutorForm />} />
            <Route path="/admin-form" element={<AdminForm />} />
            <Route path="/admin-add-topic" element={<AddTopicForm />} />
            <Route path="/admin-add-corrector" element={<AddTutorForm />} />
            <Route path="/upload-students" element={user.token && user.role === 'admin' ? <UploadCSVForm formType="students" /> : <Navigate to="/" />} />
            <Route path="/upload-topics" element={user.token && user.role === 'admin' ? <UploadCSVForm formType="topics" /> : <Navigate to="/" />} />
            <Route path="/upload-tutors" element={user.token && user.role === 'admin' ? <UploadCSVForm formType="tutors" /> : <Navigate to="/" />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>
        {/* Mostrar Footer solo si el usuario está logueado */}
        {user.token && <Footer color={color} />}
      </Box>
    </Router>
  );
};

export default App;