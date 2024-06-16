import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RoleSelection from './components/RoleSelection';
import StudentForm from './components/StudentForm';
import TeacherForm from './components/TeacherForm';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RoleSelection />} />
                <Route path="/student" element={<StudentForm />} />
                <Route path="/teacher" element={<TeacherForm />} />
            </Routes>
        </Router>
    );
};

export default App;
