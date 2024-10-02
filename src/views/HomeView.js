import { useSelector } from 'react-redux';  
import {Navigate } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';
import StudentHomeView from './Student/StudentHomeView';
import TutorHomeView from './Tutor/TutorHomeView';
import AdminDashboard from './Admin/AdminHomeView';

const HomeView = () => {
  const user = useSelector((state) => state.user); // Selecciona el estado del usuario desde Redux
  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';
  const isTutor = user?.role === 'tutor';

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
