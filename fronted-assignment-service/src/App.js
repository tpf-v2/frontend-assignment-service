import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoleSelection from './components/RoleSelection';
import StudentForm from './components/StudentForm';
import TeacherForm from './components/TeacherForm';
import AvailabilityCalendar from './components/AvailabilityCalendar';  // Importa el nuevo componente

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/student" element={<StudentForm />} />
        <Route path="/teacher" element={<TeacherForm />} />
        <Route path="/calendar" element={<AvailabilityCalendar />} />  {/* Nueva ruta */}
      </Routes>
    </Router>
  );
};

export default App;
