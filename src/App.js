import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import FormSelection from './components/Forms/FormSelection';
import StudentForm from './components/Forms/StudentForm';
import TutorForm from './components/Forms/TutorForm';
import AdminDashboard from './components/UI/Dashboards/Periods/AdminDashboard';
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
import Dashboard from './components/UI/Dashboards/AdminStats/Dashboard';
import ParentTable from './components/UI/Tables/ParentTable';
import StudentsTable from './components/UI/Tables/ChildTables/StudentsTable';
import TopicsTable from './components/UI/Tables/ChildTables/TopicsTable';
import TutorsTable from './components/UI/Tables/ChildTables/TutorsTable';
import FormAnswersTable from './components/UI/Tables/ChildTables/FormAnswersTable';
import GroupsTable from './components/UI/Tables/ChildTables/GroupsTable';
import FormClosedAlert from './components/SubmitSuccess';
import TokenManager from './components/TokenManager';
import Algorithms from './components/Algorithms/Algorithms';

import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const user = useSelector((state) => state.user);

  const resetUser = () => {
    //setUser(null);
  };

  const getColorBasedOnRole = (role) => {
    switch (role) {
      case 'tutor':
        return '#6A0DAD'; // Violeta medio oscurito
      case 'admin':
        return '#4B84F5'; // Azul clarito
      case 'student':
      default:
        return '#0072C6'; // Celeste predeterminado
    }
  };

  const color = user ? getColorBasedOnRole(user.role) : '#0072C6'; // Color predeterminado para los no logueados

  return (
    <Router>
      <TokenManager />
      <Box className="main-container">
        {/* Mostrar Header solo si el usuario está logueado */}
        {user.token && <Header user={user} color={color} handleHomeClick={resetUser} />}
        <BackgroundContainer/>
        <Box className="content-container">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/form-selection" element={<ProtectedRoute><FormSelection /></ProtectedRoute>} />
            <Route path="/dashboard/:cuatrimestre" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/table-view" element={<ProtectedRoute><ParentTable /></ProtectedRoute>} />
            <Route path="dashboard/:cuatrimestre/students" element={<ProtectedRoute><StudentsTable /></ProtectedRoute>} />
            <Route path="dashboard/:cuatrimestre/topics" element={<ProtectedRoute><TopicsTable /></ProtectedRoute>} />
            <Route path="dashboard/:cuatrimestre/tutors" element={<ProtectedRoute><TutorsTable /></ProtectedRoute>} />
            <Route path="dashboard/:cuatrimestre/form-answers" element={<ProtectedRoute><FormAnswersTable /></ProtectedRoute>} />
            <Route path="dashboard/:cuatrimestre/groups" element={<ProtectedRoute><GroupsTable /></ProtectedRoute>} />
            <Route path="/form-selection/:cuatrimestre" element={<FormSelection />} />
            <Route path="/student-form" element={<ProtectedRoute><StudentForm /></ProtectedRoute>} /> TODO: Formulario de alumnos se deshabilita manualmente 
            {/* <Route path="/student-form" element={<FormClosedAlert />} /> */}
            <Route path="/tutor-form" element={<ProtectedRoute><TutorForm /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute>{user.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/" />}</ProtectedRoute>} />
            <Route path="/admin-add-topic" element={<ProtectedRoute><AddTopicForm /></ProtectedRoute>} />
            <Route path="/admin-add-corrector" element={<ProtectedRoute><AddTutorForm /></ProtectedRoute>} />
            <Route path="/upload-students/:cuatrimestre" element={<ProtectedRoute>{user.role === 'admin' ? <UploadCSVForm formType="students" /> : <Navigate to="/" />}</ProtectedRoute>} />
            <Route path="/upload-topics/:cuatrimestre" element={<ProtectedRoute>{user.role === 'admin' ? <UploadCSVForm formType="topics" /> : <Navigate to="/" />}</ProtectedRoute>} />
            <Route path="/upload-tutors/:cuatrimestre" element={<ProtectedRoute>{user.role === 'admin' ? <UploadCSVForm formType="tutors" /> : <Navigate to="/" />}</ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile user={user} /></ProtectedRoute>} />
            <Route path="/algorithms/:cuatrimestre" element={<ProtectedRoute>{user.role === 'admin' ? <Algorithms user={user} /> : <Navigate to="/" />}</ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>
        {user.token && <Footer color={color} />}
      </Box>
    </Router>
  );
};

export default App;
