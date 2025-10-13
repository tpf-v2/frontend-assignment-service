import React from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
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
import TeamsTable from './components/UI/Tables/ChildTables/GroupsTable';
import TokenManager from './components/TokenManager';
import ProtectedRoute from './components/ProtectedRoute';
import TutorDashboardView from './views/Tutor/TutorDashboardView';
import UploadView from './views/UploadView';
import CuatrimestreConfig from './components/UI/CuatrimestreConfig';
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import ForgotPasswordView from './views/ForgotPasswordView';
import ConfirmEmailView from './views/ConfirmEmailView';
import ResetPasswordView from './views/ResetPasswordView';
import DashboardView from './views/Admin/DashboardView'
import ChangePasswordView from './views/ChangePasswordView';
import StudentForm from './components/Forms/StudentForm';
import ProposeIdea from './components/Forms/ProposeIdea';
import ExploreIdeas from './components/Exploration/ExploreIdeas';
import TutorEmails from './components/Exploration/TutorEmails';
import StudentAvailabilityView from './views/Student/StudentAvailabilityView';
import { setStudents } from './redux/slices/studentsSlice';
import { setTutors } from './redux/slices/tutorsSlice';
import { setTopics } from './redux/slices/topicsSlice';
import Credits from './views/CreditsView';

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
    <HashRouter>
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
            <Route path="/forgot-password" element={<ForgotPasswordView />} />
            <Route path="/confirm-email" element={<ConfirmEmailView />} />
            <Route path="/reset-password" element={<ResetPasswordView />} />
            <Route path="/home" element={<HomeView />} />
            <Route path="/credits" element={<Credits />} />
            {/* <Route path="/form-selection" element={<ProtectedRoute><FormSelection /></ProtectedRoute>} /> */}
            <Route path="/dashboard/:period" element={<ProtectedRoute><DashboardView /></ProtectedRoute>} />
            <Route path="/table-view" element={<ProtectedRoute><ParentTable /></ProtectedRoute>} />
            <Route path="dashboard/:period/students" element={<ProtectedRoute><StudentsTable /></ProtectedRoute>} />
            <Route path="dashboard/:period/topics" element={<ProtectedRoute><TopicsTable /></ProtectedRoute>} />
            <Route path="dashboard/:period/tutors" element={<ProtectedRoute><TutorsTable /></ProtectedRoute>} />
            <Route path="dashboard/:period/form-answers" element={<ProtectedRoute><FormAnswersTable /></ProtectedRoute>} />
            <Route path="dashboard/:period/teams" element={<ProtectedRoute><TeamsTable /></ProtectedRoute>} />
            {/* <Route path="/form-selection/:period" element={<FormSelection />} />             */}
            <Route path="/cuatrimestre-config" element={<CuatrimestreConfig />} />
            <Route path="/upload/:projectType" element={<ProtectedRoute><UploadView /></ProtectedRoute>} />
            <Route path="/student-form" element={<ProtectedRoute><StudentForm /></ProtectedRoute>} />
            <Route path="/propose-idea" element={<ProtectedRoute><ProposeIdea /></ProtectedRoute>} />
            <Route path="/explore/ideas" element={<ProtectedRoute><ExploreIdeas /></ProtectedRoute>} />            
            <Route path="/explore/tutor-emails" element={<ProtectedRoute><TutorEmails /></ProtectedRoute>} />
            <Route path="/tutor-form" element={<ProtectedRoute><TutorForm /></ProtectedRoute>} />
            <Route path="/tutor-cuatrimestre/:period" element={<ProtectedRoute><TutorDashboardView /></ProtectedRoute>} />
            <Route path="/admin-add-topic" element={<ProtectedRoute><AddTopicForm /></ProtectedRoute>} />
            <Route path="/admin-add-corrector" element={<ProtectedRoute><AddTutorForm /></ProtectedRoute>} />
            <Route path="/upload-students/:period" element={<ProtectedRoute>{user.temporal_role === 'admin' ? <UploadCSVForm formType="students" setItems={setStudents} /> : <Navigate to="/" />}</ProtectedRoute>} />
            <Route path="/upload-topics/:period" element={<ProtectedRoute>{user.temporal_role === 'admin' ? <UploadCSVForm formType="topics" setItems={setTopics}/> : <Navigate to="/" />}</ProtectedRoute>} />
            <Route path="/upload-tutors/:period" element={<ProtectedRoute>{user.temporal_role === 'admin' ? <UploadCSVForm formType="tutors" setItems={setTutors}/> : <Navigate to="/" />}</ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile user={user} /></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute><ChangePasswordView /></ProtectedRoute>} />
            <Route path="/availability-view" element={<ProtectedRoute><StudentAvailabilityView /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>
        {user.token && <Footer color={color} />}
      </Box>
    </HashRouter>
  );
};

export default App;
