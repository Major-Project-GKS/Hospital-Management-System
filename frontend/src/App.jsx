import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // ✅ ADD

// Components
import Navbar from './Components/Navbar';
import Home from './Pages/Public/Home';
import LoginRegister from './Pages/Public/LoginRegister';
import PublicSchedule from './Pages/Public/PublicSchedule';

import BookAppointment from './Pages/Patient/BookAppointment';
import PatientDashboard from './Pages/Patient/PatientDashboard';

import DoctorDashboard from './Pages/Doctor/DoctorDashboard';
import PatientQueue from './Pages/Doctor/PatientQueue';

import ManagerDashboard from './Pages/Manager/ManagerDashboard';
import ManageSchedule from './Pages/Manager/ManageSchedule';

import './App.css';

function App() {
  return (
    <Router>
      <Navbar />

      {/* ✅ TOAST CONTAINER */}
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/schedule" element={<PublicSchedule />} />
        
        <Route path="/appointment" element={<BookAppointment />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />

        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/queue" element={<PatientQueue />} />

        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/schedule" element={<ManageSchedule />} />
      </Routes>
    </Router>
  );
}

export default App; 