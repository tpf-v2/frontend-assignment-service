import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import FormSelection from './components/Forms/FormSelection';
import TutorForm from './components/Forms/TutorForm';
import AddTopicForm from './components/Forms/AddTopicForm';
import AddTutorForm from './components/Forms/AddTutorForm';
import UploadCSVForm from './components/Forms/UploadCSVForm';
import Header from './components/UI/Header';
import Footer from './components/UI/Footer';
import Profile from './components/Profile';
import { Box } from '@mui/material';
import BackgroundContainer from './components/UI/BackgroundContainer';
import './App.css'; // Import global styles
import { useSelector } from "react-redux";
import ParentTable from './components/UI/Tables/ParentTable';
import StudentsTable from './components/UI/Tables/ChildTables/StudentsTable';
import TopicsTable from './components/UI/Tables/ChildTables/TopicsTable';
import TutorsTable from './components/UI/Tables/ChildTables/TutorsTable';
import FormAnswersTable from './components/UI/Tables/ChildTables/FormAnswersTable';
import GroupsTable from './components/UI/Tables/ChildTables/GroupsTable';
import ClosedAlert from './components/ClosedAlert';
import TokenManager from './components/TokenManager';

import ProtectedRoute from './components/ProtectedRoute';
import TutorDashboardView from './views/Tutor/TutorDashboardView';
import UploadView from './views/UploadView';
import CuatrimestreConfig from './components/UI/CuatrimestreConfig';
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import DashboardView from './views/Admin/DashboardView';
import StudentAvailabilityView from './views/Student/StudentAvailabilityView';

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

  const color = user ? getColorBasedOnRole(user.temporal_role) : '#0072C6'; // Default color

  return (
    <Router>
      <TokenManager />
      <Box
        className="main-container"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {user.token && (
          <Header user={user} color={color} handleHomeClick={resetUser} />
        )}
        <BackgroundContainer />
        <Box
          className="content-container"
          sx={{
            flex: '1',
            minHeight: '1000px',
            overflowY: 'auto', // Add scrolling if content exceeds
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Routes>
            <Route path="/" element={<LoginView />} />
            <Route path="/home" element={<HomeView />} />
            <Route path="/form-selection" element={<ProtectedRoute><FormSelection /></ProtectedRoute>} />
            <Route path="/dashboard/:period" element={<ProtectedRoute><DashboardView /></ProtectedRoute>} />
            <Route path="/table-view" element={<ProtectedRoute><ParentTable /></ProtectedRoute>} />
            <Route path="dashboard/:period/students" element={<ProtectedRoute><StudentsTable /></ProtectedRoute>} />
            <Route path="dashboard/:period/topics" element={<ProtectedRoute><TopicsTable /></ProtectedRoute>} />
            <Route path="dashboard/:period/tutors" element={<ProtectedRoute><TutorsTable /></ProtectedRoute>} />
            <Route path="dashboard/:period/form-answers" element={<ProtectedRoute><FormAnswersTable /></ProtectedRoute>} />
            <Route path="dashboard/:period/groups" element={<ProtectedRoute><GroupsTable /></ProtectedRoute>} />
            <Route path="/form-selection/:period" element={<FormSelection />} />            
            <Route path="/cuatrimestre-config" element={<CuatrimestreConfig />} />
            <Route path="/student-form" element={<ProtectedRoute><ClosedAlert message="No se aceptan mas respuestas al formulario de grupos."/></ProtectedRoute>} /> TODO: Formulario de alumnos se deshabilita manualmente 
            <Route path="/initial-project" element={<UploadView />} />
            {/* <Route path="/student-form" element={<StudentForm />} /> */}
            <Route path="/tutor-form" element={<ProtectedRoute><TutorForm /></ProtectedRoute>} />
            <Route path="/tutor-cuatrimestre/:period" element={<ProtectedRoute><TutorDashboardView /></ProtectedRoute>} />
            <Route path="/admin-add-topic" element={<ProtectedRoute><AddTopicForm /></ProtectedRoute>} />
            <Route path="/admin-add-corrector" element={<ProtectedRoute><AddTutorForm /></ProtectedRoute>} />
            <Route path="/upload-students/:period" element={<ProtectedRoute>{user.temporal_role === 'admin' ? <UploadCSVForm formType="students" /> : <Navigate to="/" />}</ProtectedRoute>} />
            <Route path="/upload-topics/:period" element={<ProtectedRoute>{user.temporal_role === 'admin' ? <UploadCSVForm formType="topics" /> : <Navigate to="/" />}</ProtectedRoute>} />
            <Route path="/upload-tutors/:period" element={<ProtectedRoute>{user.temporal_role === 'admin' ? <UploadCSVForm formType="tutors" /> : <Navigate to="/" />}</ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile user={user} /></ProtectedRoute>} />
            <Route path="/availability-view" element={<ProtectedRoute><StudentAvailabilityView /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>
        {user.token && <Footer color={color} />}
      </Box>
    </Router>
  );
};

export default App;