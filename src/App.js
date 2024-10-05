import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import UploadCSVForm from './components/SharedResources/Uploads/UploadCSV';
import Header from './components/UI/Header';
import Footer from './components/UI/Footer';
import Profile from './components/SharedResources/Profile';
import { Box } from '@mui/material';
import BackgroundContainer from './components/SharedResources/BackgroundContainer';
import './App.css'; // Importar los estilos globales
import { useSelector } from "react-redux";
import ParentTable from './components/SharedResources/Tables/ParentTable';
import StudentsTable from './components/Roles/Admin/Table/StudentsTable';
import TopicsTable from './components/SharedResources/Tables/ChildTables/TopicsTable';
import FormAnswersTable from './components/SharedResources/Tables/ChildTables/FormAnswersTable';
import GroupsTable from './components/SharedResources/Tables/ChildTables/GroupsTable';
import ClosedAlert from './components/SharedResources/ClosedAlert';
import TokenManager from './components/TokenManager';
import Algorithms from './components/Roles/Admin/Algorithms/Algorithms';
import ProtectedRoute from './components/SharedResources/Navigation/ProtectedRoute';
import TutorDashboardView from './views/Tutor/TutorDashboardView';
import UploadView from './views/UploadView';
import CuatrimestreConfig from './components/Roles/Admin/CuatrimestreConfig';
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import DashboardView from './views/Admin/DashboardView'
import TutorsTable from './components/Roles/Admin/Table/TutorsTable';

const App = () => {
  const user = useSelector((state) => state.user);

  const resetUser = () => {
    //setUser(null);
  };

  const getColorBasedOnRole = (role) => {
    switch (role) {
      case 'tutor':
        return '#0052C6'; // Violeta medio oscurito
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

            {/* Common Routes */}
            <Route path="/" element={<LoginView />} />
            <Route path="/home" element={<HomeView/>} />
            <Route path="/profile" element={<ProtectedRoute><Profile user={user} /></ProtectedRoute>} />

            {/* Student Routes */}
            <Route path="/student-form" element={<ProtectedRoute><ClosedAlert message="No se aceptan mas respuestas al formulario de grupos."/></ProtectedRoute>} />
            <Route path="/initial-project" element={<UploadView />} />

            {/* Tutor Routes */}
            <Route path="/tutor-cuatrimestre/:cuatrimestre" element={<ProtectedRoute><TutorDashboardView /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/upload-students/:cuatrimestre" element={<ProtectedRoute>{user.role === 'admin' ? <UploadCSVForm formType="students" /> : <Navigate to="/" />}</ProtectedRoute>} />
            <Route path="/upload-topics/:cuatrimestre" element={<ProtectedRoute>{user.role === 'admin' ? <UploadCSVForm formType="topics" /> : <Navigate to="/" />}</ProtectedRoute>} />
            <Route path="/upload-tutors/:cuatrimestre" element={<ProtectedRoute>{user.role === 'admin' ? <UploadCSVForm formType="tutors" /> : <Navigate to="/" />}</ProtectedRoute>} />
            <Route path="/algorithms/:cuatrimestre" element={<ProtectedRoute>{user.role === 'admin' ? <Algorithms user={user} /> : <Navigate to="/" />}</ProtectedRoute>} />
            <Route path="/dashboard/:cuatrimestre" element={<ProtectedRoute><DashboardView /></ProtectedRoute>} />
            <Route path="/table-view" element={<ProtectedRoute><ParentTable /></ProtectedRoute>} />
            <Route path="dashboard/:cuatrimestre/students" element={<ProtectedRoute><StudentsTable /></ProtectedRoute>} />
            <Route path="dashboard/:cuatrimestre/topics" element={<ProtectedRoute><TopicsTable /></ProtectedRoute>} />
            <Route path="dashboard/:cuatrimestre/tutors" element={<ProtectedRoute><TutorsTable /></ProtectedRoute>} />
            <Route path="dashboard/:cuatrimestre/form-answers" element={<ProtectedRoute><FormAnswersTable /></ProtectedRoute>} />
            <Route path="dashboard/:cuatrimestre/groups" element={<ProtectedRoute><GroupsTable /></ProtectedRoute>} />     
            <Route path="/cuatrimestre-config" element={<CuatrimestreConfig />} />                        

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>
        {user.token && <Footer color={color} />}
      </Box>
    </Router>
  );
};

export default App;
