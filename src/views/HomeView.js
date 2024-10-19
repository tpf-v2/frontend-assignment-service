import { useSelector } from 'react-redux';  
import {Navigate } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';
import StudentHomeView from './Student/StudentHomeView';
import TutorHomeView from './Tutor/TutorHomeView';
import AdminDashboard from './Admin/AdminHomeView';

const HomeView = () => {
  const user = useSelector((state) => state.user); // Selecciona el estado del usuario desde Redux
  const isAdmin = user?.temporal_role === 'admin';
  const isStudent = user?.temporal_role === 'student';
  const isTutor = user?.temporal_role === 'tutor';

  return (
    <>
      {isAdmin ? (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      ) : isStudent ? (
        <ProtectedRoute>
          <StudentHomeView />
        </ProtectedRoute>
      ) : isTutor ? (
        <ProtectedRoute>
          <TutorHomeView />
        </ProtectedRoute>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default HomeView;